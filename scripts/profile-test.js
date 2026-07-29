'use strict'

/**
 * Development helper: asserts that profiles actually gate what gets scheduled.
 *
 *   npx electron scripts/profile-test.js
 */

process.env.POMOPT_DEV = '1'

require('./_harness')
require('../src/main/index.js')

const { app, ipcMain } = require('electron')
const { buildBreakPlan } = require('../src/main/scheduler')
const { validate } = require('../src/shared/exercises')

const invoke = (channel, ...args) => {
  const handler = ipcMain._invokeHandlers.get(channel)
  return handler ? handler({}, ...args) : undefined
}

const check = (label, ok, detail = '') =>
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? '  (' + detail + ')' : ''}`)

function sample (profile, kind, rounds = 30) {
  const ids = new Set()
  let recent = []
  for (let i = 0; i < rounds; i++) {
    const plan = buildBreakPlan(kind, kind === 'long' ? 900 : 300, profile, recent)
    plan.exercises.forEach((e) => ids.add(e.id))
    recent = [...recent, ...plan.exercises.map((e) => e.id)].slice(-20)
  }
  return ids
}

async function run () {
  const problems = validate()
  check('exercise library validates', problems.length === 0, problems.slice(0, 3).join('; '))

  // Handlers return plain values, not promises — await normalises both.
  let settings = (await invoke('app:bootstrap')).settings
  const lib = await invoke('exercises:list')
  const byId = new Map(lib.map((e) => [e.id, e]))

  // ---- Office ----------------------------------------------------------
  settings = await invoke('profile:activate', 'office')
  const office = settings.profiles.office
  check('office profile is active', settings.activeProfile === 'office')

  const officeShort = sample(office, 'short')
  const officeLong = sample(office, 'long')
  const officeAll = new Set([...officeShort, ...officeLong])

  const needsGear = [...officeAll].filter((id) => {
    const ex = byId.get(id)
    return ex.equipment.some((eq) => !office.equipment[eq])
  })
  check('office never schedules unavailable equipment', needsGear.length === 0, needsGear.join(','))

  const tooHard = [...officeAll].filter((id) => byId.get(id).intensity !== 'low')
  check('office respects the low intensity cap', tooHard.length === 0, tooHard.join(','))

  const offPack = [...officeAll].filter((id) => !['knee-pt', 'stretch'].includes(byId.get(id).pack))
  check('office only draws from its enabled packs', offPack.length === 0, offPack.join(','))

  const notDesk = [...officeShort].filter((id) => byId.get(id).setting !== 'desk')
  check('short breaks stay at the desk', notDesk.length === 0, notDesk.join(','))

  // ---- Home ------------------------------------------------------------
  settings = await invoke('profile:activate', 'home')
  const home = settings.profiles.home
  const homeAll = new Set([...sample(home, 'short'), ...sample(home, 'long')])
  const homePacks = new Set([...homeAll].map((id) => byId.get(id).pack))
  check('home draws from many packs', homePacks.size >= 5, [...homePacks].join(','))
  check('home reaches bench work', [...homeAll].some((id) => byId.get(id).equipment.includes('bench')))
  check('home is a bigger pool than office', homeAll.size > officeAll.size, `${homeAll.size} vs ${officeAll.size}`)

  // Anchor guarantee: the knee pack appears in every single break.
  let recent = []
  let missing = 0
  for (let i = 0; i < 25; i++) {
    const plan = buildBreakPlan('short', 300, home, recent)
    if (!plan.exercises.some((e) => e.pack === 'knee-pt')) missing++
    recent = [...recent, ...plan.exercises.map((e) => e.id)].slice(-20)
  }
  check('knee pack anchors every break', missing === 0, `${missing}/25 breaks missed it`)

  // ---- Weight gating ---------------------------------------------------
  settings = await invoke('profile:update', {
    key: 'home',
    patch: { maxDumbbellLb: 12 }
  })
  const light = settings.profiles.home
  const overWeight = [...sample(light, 'long', 40)].filter((id) => (byId.get(id).minWeightLb || 0) > 12)
  check('dumbbell weight limit is honoured', overWeight.length === 0, overWeight.join(','))
  await invoke('profile:update', { key: 'home', patch: { maxDumbbellLb: 52.5 } })

  // ---- Group toggles ---------------------------------------------------
  settings = await invoke('profile:update', {
    key: 'home',
    patch: { packs: { 'knee-pt': { groups: { outtoe: false, mobility: false, circulation: false } } } }
  })
  const kneeOnly = settings.profiles.home
  const kneeIds = [...sample(kneeOnly, 'short', 25)].filter((id) => byId.get(id).pack === 'knee-pt')
  const wrongGroup = kneeIds.filter((id) => !byId.get(id).groups.includes('hyperextension'))
  check('group toggles filter within a pack', wrongGroup.length === 0, wrongGroup.join(','))

  // ---- Profile CRUD ----------------------------------------------------
  settings = await invoke('profile:add', { name: 'Hotel', copyFrom: 'office' })
  const added = Object.entries(settings.profiles).find(([, p]) => p.name === 'Hotel')
  check('can add a profile', !!added, added ? added[0] : '')
  if (added) {
    settings = await invoke('profile:remove', added[0])
    check('can remove a profile', !Object.values(settings.profiles).some((p) => p.name === 'Hotel'))
  }
}

app.whenReady().then(async () => {
  try {
    await run()
  } catch (err) {
    console.error('FAIL  test harness threw:', err && err.stack ? err.stack : err)
    process.exitCode = 1
  } finally {
    // Always quit, or a thrown assertion leaves the app running forever.
    global.__pomoptQuitting = true
    app.quit()
  }
})
