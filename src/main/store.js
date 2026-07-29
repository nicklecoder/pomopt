'use strict'

const fs = require('fs')
const path = require('path')
const { app } = require('electron')
const { DEFAULT_SETTINGS, DEFAULT_PROFILES, packMap, equipmentMap } = require('../shared/defaults')
const { PACKS, EQUIPMENT_IDS } = require('../shared/packs')

const FILE = () => path.join(app.getPath('userData'), 'pomopt-state.json')

const EMPTY = {
  settings: JSON.parse(JSON.stringify(DEFAULT_SETTINGS)),
  // Ring buffer of recently prescribed exercise ids, most recent last.
  recent: [],
  // { 'YYYY-MM-DD': { pomodoros: n, breaks: n, exercises: { id: count } } }
  history: {}
}

let state = null

/**
 * Fill in anything a stored profile is missing — new equipment items, new
 * packs, or new groups added since it was written — without discarding the
 * user's existing choices.
 */
function normaliseProfile (stored, fallback) {
  const base = fallback || DEFAULT_PROFILES.home
  const profile = {
    name: stored.name || base.name,
    maxIntensity: stored.maxIntensity || base.maxIntensity,
    maxDumbbellLb: typeof stored.maxDumbbellLb === 'number' ? stored.maxDumbbellLb : base.maxDumbbellLb,
    equipment: { ...equipmentMap([]), ...(base.equipment || {}), ...(stored.equipment || {}) },
    packs: {}
  }

  // Drop equipment ids that no longer exist in the catalogue.
  for (const id of Object.keys(profile.equipment)) {
    if (!EQUIPMENT_IDS.includes(id)) delete profile.equipment[id]
  }

  const defaults = packMap(null)
  for (const pack of PACKS) {
    const storedPack = (stored.packs || {})[pack.id]
    const basePack = (base.packs || {})[pack.id] || defaults[pack.id]
    profile.packs[pack.id] = {
      enabled: storedPack ? !!storedPack.enabled : basePack.enabled,
      anchor: storedPack && storedPack.anchor !== undefined ? !!storedPack.anchor : basePack.anchor,
      groups: Object.fromEntries(
        pack.groups.map((g) => {
          const v = storedPack && storedPack.groups ? storedPack.groups[g.id] : undefined
          return [g.id, v === undefined ? true : !!v]
        })
      )
    }
  }
  return profile
}

function normaliseSettings (stored) {
  const s = { ...DEFAULT_SETTINGS, ...(stored || {}) }

  const storedProfiles = (stored && stored.profiles) || {}
  const profiles = {}
  const keys = Object.keys(storedProfiles).length ? Object.keys(storedProfiles) : Object.keys(DEFAULT_PROFILES)
  for (const key of keys) {
    profiles[key] = normaliseProfile(storedProfiles[key] || {}, DEFAULT_PROFILES[key])
  }
  // Always keep at least one profile around.
  if (Object.keys(profiles).length === 0) {
    Object.assign(profiles, JSON.parse(JSON.stringify(DEFAULT_PROFILES)))
  }
  s.profiles = profiles

  if (!profiles[s.activeProfile]) s.activeProfile = Object.keys(profiles)[0]

  // Settings from before packs existed carried a flat equipment map and an
  // allowFloorWork flag; fold those into the Home profile rather than losing them.
  if (stored && stored.equipment && !stored.profiles) {
    const home = profiles.home || profiles[s.activeProfile]
    Object.assign(home.equipment, stored.equipment)
    if (stored.allowFloorWork !== undefined) home.equipment.floor = !!stored.allowFloorWork
  }
  delete s.equipment
  delete s.allowFloorWork

  return s
}

function load () {
  if (state) return state
  try {
    const parsed = JSON.parse(fs.readFileSync(FILE(), 'utf8'))
    state = {
      ...EMPTY,
      ...parsed,
      settings: normaliseSettings(parsed.settings)
    }
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error('[pomopt] could not read state, starting fresh:', err.message)
    }
    state = JSON.parse(JSON.stringify(EMPTY))
  }
  return state
}

let writeTimer = null

function writeNow () {
  if (!state) return
  try {
    fs.mkdirSync(path.dirname(FILE()), { recursive: true })
    fs.writeFileSync(FILE(), JSON.stringify(state, null, 2))
  } catch (err) {
    console.error('[pomopt] could not write state:', err.message)
  }
}

function save () {
  if (writeTimer) return
  writeTimer = setTimeout(() => {
    writeTimer = null
    writeNow()
  }, 250)
}

/** Write any debounced change immediately — call before the process exits. */
function flush () {
  if (!writeTimer) return
  clearTimeout(writeTimer)
  writeTimer = null
  writeNow()
}

// ---------------------------------------------------------------- settings

function getSettings () {
  return load().settings
}

function setSettings (patch) {
  const s = load()
  s.settings = { ...s.settings, ...patch, profiles: s.settings.profiles }
  save()
  return s.settings
}

// ---------------------------------------------------------------- profiles

function getActiveProfile () {
  const s = getSettings()
  return s.profiles[s.activeProfile]
}

function setActiveProfile (key) {
  const s = load()
  if (!s.settings.profiles[key]) return s.settings
  s.settings.activeProfile = key
  save()
  return s.settings
}

/** Deep-merge a patch into one profile. Only known keys are honoured. */
function updateProfile (key, patch) {
  const s = load()
  const profile = s.settings.profiles[key]
  if (!profile) return s.settings

  if (patch.name !== undefined) profile.name = String(patch.name).slice(0, 40) || profile.name
  if (patch.maxIntensity !== undefined) profile.maxIntensity = patch.maxIntensity
  if (patch.maxDumbbellLb !== undefined) {
    profile.maxDumbbellLb = Math.max(0, Number(patch.maxDumbbellLb) || 0)
  }
  if (patch.equipment) {
    for (const [id, on] of Object.entries(patch.equipment)) {
      if (EQUIPMENT_IDS.includes(id)) profile.equipment[id] = !!on
    }
  }
  if (patch.packs) {
    for (const [packId, packPatch] of Object.entries(patch.packs)) {
      const target = profile.packs[packId]
      if (!target) continue
      if (packPatch.enabled !== undefined) target.enabled = !!packPatch.enabled
      if (packPatch.anchor !== undefined) target.anchor = !!packPatch.anchor
      if (packPatch.groups) {
        for (const [groupId, on] of Object.entries(packPatch.groups)) {
          if (groupId in target.groups) target.groups[groupId] = !!on
        }
      }
    }
  }

  save()
  return s.settings
}

function addProfile (name, copyFromKey) {
  const s = load()
  const source = s.settings.profiles[copyFromKey] || DEFAULT_PROFILES.home
  let key = String(name || 'New profile').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  if (!key) key = 'profile'
  let unique = key
  let n = 2
  while (s.settings.profiles[unique]) unique = `${key}-${n++}`

  s.settings.profiles[unique] = {
    ...JSON.parse(JSON.stringify(source)),
    name: name || 'New profile'
  }
  s.settings.activeProfile = unique
  save()
  return s.settings
}

function removeProfile (key) {
  const s = load()
  if (Object.keys(s.settings.profiles).length <= 1) return s.settings
  delete s.settings.profiles[key]
  if (s.settings.activeProfile === key) {
    s.settings.activeProfile = Object.keys(s.settings.profiles)[0]
  }
  save()
  return s.settings
}

// ------------------------------------------------------------------ recent

function getRecent () {
  return load().recent
}

function pushRecent (ids) {
  const s = load()
  s.recent = [...s.recent, ...ids].slice(-20)
  save()
}

// ----------------------------------------------------------------- history

function todayKey (now = new Date()) {
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function dayRecord (key = todayKey()) {
  const s = load()
  if (!s.history[key]) {
    s.history[key] = { pomodoros: 0, breaks: 0, exercises: {} }
  }
  return s.history[key]
}

function recordPomodoro () {
  dayRecord().pomodoros += 1
  save()
}

function recordBreak () {
  dayRecord().breaks += 1
  save()
}

function recordExercise (id) {
  const day = dayRecord()
  day.exercises[id] = (day.exercises[id] || 0) + 1
  save()
}

// Hand out copies — callers (and IPC snapshots) must not alias live state.
function snapshotDay (key, rec) {
  return {
    date: key,
    pomodoros: rec.pomodoros,
    breaks: rec.breaks,
    exercises: { ...rec.exercises }
  }
}

function getToday () {
  const key = todayKey()
  return snapshotDay(key, dayRecord(key))
}

function getHistory (days = 7) {
  const s = load()
  const out = []
  const now = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const key = todayKey(d)
    out.push(snapshotDay(key, s.history[key] || { pomodoros: 0, breaks: 0, exercises: {} }))
  }
  return out
}

module.exports = {
  flush,
  getSettings,
  setSettings,
  getActiveProfile,
  setActiveProfile,
  updateProfile,
  addProfile,
  removeProfile,
  getRecent,
  pushRecent,
  recordPomodoro,
  recordBreak,
  recordExercise,
  getToday,
  getHistory
}
