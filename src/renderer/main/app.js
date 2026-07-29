'use strict'

const $ = (id) => document.getElementById(id)

let settings = null
let profileKey = null
let profile = null
let library = []
let catalog = { packs: [], equipment: [], intensities: [] }
let lastMode = null
let currentState = null

function clock (seconds) {
  const s = Math.max(0, Math.ceil(seconds))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

function adoptSettings (next) {
  settings = next
  profileKey = next.activeProfile
  profile = next.profiles[profileKey]
}

// ------------------------------------------------------------------- tabs

document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((t) => t.classList.toggle('is-active', t === tab))
    document.querySelectorAll('.panel').forEach((p) => {
      p.classList.toggle('is-active', p.id === `panel-${tab.dataset.tab}`)
    })
    if (tab.dataset.tab === 'today') refreshStats()
    if (tab.dataset.tab === 'library') refreshLibrary()
  })
})

// --------------------------------------------------------------- prompt

/** Small in-window text prompt; window.prompt is unavailable in Electron. */
function askText (label, initial) {
  return new Promise((resolve) => {
    const backdrop = $('prompt')
    $('promptLabel').textContent = label
    $('promptInput').value = initial || ''
    backdrop.hidden = false
    $('promptInput').focus()
    $('promptInput').select()

    const done = (value) => {
      backdrop.hidden = true
      $('promptOk').removeEventListener('click', ok)
      $('promptCancel').removeEventListener('click', cancel)
      $('promptInput').removeEventListener('keydown', key)
      resolve(value)
    }
    const ok = () => done($('promptInput').value.trim() || null)
    const cancel = () => done(null)
    const key = (e) => {
      if (e.key === 'Enter') ok()
      else if (e.key === 'Escape') cancel()
    }

    $('promptOk').addEventListener('click', ok)
    $('promptCancel').addEventListener('click', cancel)
    $('promptInput').addEventListener('keydown', key)
  })
}

// ------------------------------------------------------------------ timer

const MODE_TEXT = {
  idle: 'Ready',
  work: 'Focus',
  warn: 'Break incoming',
  short: 'Short break',
  long: 'Long break'
}

function renderCycle (state) {
  const every = state.settings.longBreakEvery
  const done = state.completedPomodoros % every
  const filled = state.mode === 'long' ? every : done

  $('cycle').replaceChildren(
    ...Array.from({ length: every }, (_, i) => {
      const pip = document.createElement('span')
      pip.className = 'pip' + (i === every - 1 ? ' long' : '') + (i < filled ? ' done' : '')
      return pip
    })
  )

  const left = every - done
  $('cycleNote').textContent =
    state.mode === 'long'
      ? 'Cycle complete — enjoy the long one'
      : state.completedPomodoros === 0
        ? `Long break after ${every} focus blocks`
        : `${left} more focus ${left === 1 ? 'block' : 'blocks'} until a long break`
}

function renderTimer (state) {
  adoptSettings(state.settings)
  currentState = state

  const label = $('modeLabel')
  label.textContent = state.hold
    ? 'On hold'
    : state.snoozePending && state.mode === 'work'
      ? 'Snoozed break'
      : MODE_TEXT[state.mode]
  label.className =
    'mode-label' +
    (state.hold ? ' is-warn' : '') +
    (!state.hold && state.mode === 'idle' ? ' is-idle' : '') +
    (state.mode === 'warn' ? ' is-warn' : '') +
    (state.mode === 'short' || state.mode === 'long' ? ' is-break' : '')

  $('clock').textContent =
    state.mode === 'idle' ? clock(state.settings.workMinutes * 60) : clock(state.remainingSeconds)

  const pct = state.totalSeconds ? (state.elapsedSeconds / state.totalSeconds) * 100 : 0
  $('ringFill').style.width = `${Math.min(100, Math.max(0, pct))}%`

  renderCycle(state)

  renderHold(state)

  const idle = state.mode === 'idle'
  $('btnPrimary').textContent = idle ? 'Start focus' : state.running ? 'Pause' : 'Resume'
  $('btnSkip').disabled = idle
  $('btnStop').disabled = idle
  $('btnAdjMinus').disabled = idle
  $('btnAdjPlus').disabled = idle

  renderProfileChips()

  if (lastMode !== null && lastMode !== state.mode) refreshStats()
  lastMode = state.mode

  if (state.today) {
    $('statPomos').textContent = state.today.pomodoros
    $('statBreaks').textContent = state.today.breaks
  }
}

$('btnPrimary').addEventListener('click', () => {
  if (!currentState || currentState.mode === 'idle') window.pomopt.startWork()
  else window.pomopt.toggle()
})
function renderHold (state) {
  const held = !!state.hold
  $('holdBanner').hidden = !held
  $('btnMeeting').hidden = held

  if (held) {
    const owed = state.hold.owed
    let back = 'Resume puts you back where you were.'
    if (owed && owed.type === 'break') {
      // A break interrupted part-way owes its remainder; one deferred at the
      // warning stage owes the whole thing.
      back = owed.seconds
        ? `You still owe ${Math.max(1, Math.round(owed.seconds / 60))} min of that break.`
        : `A ${owed.kind === 'long' ? 'long' : 'short'} break is still owed.`
    } else if (owed && owed.type === 'work') {
      back = 'Your focus block picks up where it left off.'
    }
    $('holdDetail').textContent = `${state.hold.minutes} min so far. ${back}`
  }
}

$('btnMeeting').addEventListener('click', () => window.pomopt.beginHold())
$('btnResumeHold').addEventListener('click', () => window.pomopt.releaseHold())
$('btnSkip').addEventListener('click', () => window.pomopt.skipPhase())
$('btnStop').addEventListener('click', () => window.pomopt.stop())
$('btnAdjMinus').addEventListener('click', () => window.pomopt.adjust(-300))
$('btnAdjPlus').addEventListener('click', () => window.pomopt.adjust(300))
$('btnShort').addEventListener('click', () => window.pomopt.startBreak('short'))
$('btnLong').addEventListener('click', () => window.pomopt.startBreak('long'))

// --------------------------------------------------------------- profiles

function profileEntries () {
  return Object.entries(settings.profiles).map(([key, p]) => ({ key, name: p.name }))
}

function chipRow (container) {
  container.replaceChildren(
    ...profileEntries().map(({ key, name }) => {
      const chip = document.createElement('button')
      chip.type = 'button'
      chip.className = 'chip' + (key === profileKey ? ' is-active' : '')
      chip.textContent = name
      chip.addEventListener('click', async () => {
        if (key === profileKey) return
        adoptSettings(await window.pomopt.activateProfile(key))
        renderAll()
      })
      return chip
    })
  )
}

function renderProfileChips () {
  chipRow($('profileChipsTimer'))
  chipRow($('profileChips'))
}

$('btnAddProfile').addEventListener('click', async () => {
  const name = await askText('Name the new profile', `${profile.name} copy`)
  if (!name) return
  adoptSettings(await window.pomopt.addProfile(name, profileKey))
  renderAll()
})

$('btnRenameProfile').addEventListener('click', async () => {
  const name = await askText('Rename this profile', profile.name)
  if (!name) return
  adoptSettings(await window.pomopt.updateProfile(profileKey, { name }))
  renderAll()
})

$('btnDeleteProfile').addEventListener('click', async () => {
  if (Object.keys(settings.profiles).length <= 1) return
  adoptSettings(await window.pomopt.removeProfile(profileKey))
  renderAll()
})

async function patchProfile (patch) {
  adoptSettings(await window.pomopt.updateProfile(profileKey, patch))
  refreshLibrary()
  renderPoolNote()
}

// -------------------------------------------------------------- equipment

function renderEquipment () {
  const sections = []
  for (const item of catalog.equipment) {
    let section = sections.find((s) => s.name === item.section)
    if (!section) sections.push((section = { name: item.section, items: [] }))
    section.items.push(item)
  }

  $('equipment').replaceChildren(
    ...sections.flatMap((section) => {
      const head = document.createElement('p')
      head.className = 'equip-head'
      head.textContent = section.name

      const wrap = document.createElement('div')
      wrap.className = 'equipment-row'
      wrap.append(
        ...section.items.map((item) => {
          const label = document.createElement('label')
          label.className = 'equip'
          const input = document.createElement('input')
          input.type = 'checkbox'
          input.checked = !!profile.equipment[item.id]
          input.addEventListener('change', () => {
            patchProfile({ equipment: { [item.id]: input.checked } })
          })
          const span = document.createElement('span')
          span.textContent = item.label
          label.append(input, span)
          return label
        })
      )
      return [head, wrap]
    })
  )
}

// ------------------------------------------------------------------ packs

function renderPacks () {
  $('packs').replaceChildren(
    ...catalog.packs.map((pack) => {
      const cfg = profile.packs[pack.id]
      const card = document.createElement('div')
      card.className = 'pack' + (cfg.enabled ? '' : ' is-off')

      const head = document.createElement('label')
      head.className = 'pack-head'
      const toggle = document.createElement('input')
      toggle.type = 'checkbox'
      toggle.checked = cfg.enabled
      toggle.addEventListener('change', () => {
        patchProfile({ packs: { [pack.id]: { enabled: toggle.checked } } }).then(renderPacks)
      })
      const title = document.createElement('div')
      title.className = 'pack-title'
      const name = document.createElement('strong')
      name.textContent = pack.name
      const blurb = document.createElement('em')
      blurb.textContent = pack.blurb
      title.append(name, blurb)
      head.append(toggle, title)

      const body = document.createElement('div')
      body.className = 'pack-body'

      const anchor = document.createElement('label')
      anchor.className = 'anchor-toggle'
      const anchorInput = document.createElement('input')
      anchorInput.type = 'checkbox'
      anchorInput.checked = cfg.anchor
      anchorInput.addEventListener('change', () => {
        patchProfile({ packs: { [pack.id]: { anchor: anchorInput.checked } } })
      })
      const anchorText = document.createElement('span')
      anchorText.textContent = 'Guarantee a slot in every break'
      anchor.append(anchorInput, anchorText)

      const groups = document.createElement('div')
      groups.className = 'group-row'
      groups.append(
        ...pack.groups.map((g) => {
          const label = document.createElement('label')
          label.className = 'equip'
          const input = document.createElement('input')
          input.type = 'checkbox'
          input.checked = !!cfg.groups[g.id]
          input.addEventListener('change', () => {
            patchProfile({ packs: { [pack.id]: { groups: { [g.id]: input.checked } } } })
          })
          const span = document.createElement('span')
          span.textContent = g.label
          label.append(input, span)
          return label
        })
      )

      body.append(anchor, groups)
      card.append(head, body)
      return card
    })
  )
}

// ---------------------------------------------------------------- library

function refreshLibrary () {
  window.pomopt.getExerciseLibrary().then((list) => {
    library = list
    renderLibrary()
    renderPoolNote()
  })
}

function renderLibrary () {
  const onlyAvailable = $('libOnlyAvailable').checked
  const packName = new Map(catalog.packs.map((p) => [p.id, p.name]))
  const groupLabel = new Map(
    catalog.packs.flatMap((p) => p.groups.map((g) => [`${p.id}:${g.id}`, g.label]))
  )

  const visible = library.filter(
    (ex) => !onlyAvailable || (ex.availability && (ex.availability.short || ex.availability.long))
  )
  $('libAvailNote').textContent =
    `${visible.length} of ${library.length} exercises available on "${profile.name}".`

  const nodes = []
  for (const pack of catalog.packs) {
    const inPack = visible.filter((ex) => ex.pack === pack.id)
    if (!inPack.length) continue

    const head = document.createElement('h2')
    head.className = 'section-head'
    head.textContent = `${pack.name} (${inPack.length})`
    nodes.push(head)

    for (const ex of inPack) {
      const available = ex.availability && (ex.availability.short || ex.availability.long)
      const item = document.createElement('div')
      item.className = 'lib-item' + (available ? '' : ' unavailable')

      const top = document.createElement('div')
      top.className = 'lib-top'
      const name = document.createElement('div')
      name.className = 'lib-name'
      name.textContent = ex.name
      const dose = document.createElement('div')
      dose.className = 'lib-dose'
      dose.textContent = ex.dose
      top.append(name, dose)

      const tags = document.createElement('div')
      tags.className = 'lib-tags'
      for (const g of ex.groups) {
        const t = document.createElement('span')
        t.className = 'lib-tag focus-' + ex.pack
        t.textContent = groupLabel.get(`${ex.pack}:${g}`) || g
        tags.append(t)
      }
      if (ex.availability && ex.availability.short) {
        const t = document.createElement('span')
        t.className = 'lib-tag lib-tag-ok'
        t.textContent = 'short breaks'
        tags.append(t)
      }
      const needs = [...ex.equipment]
      if (ex.minWeightLb) needs.push(`${ex.minWeightLb}lb+`)
      const meta = document.createElement('span')
      meta.className = 'lib-tag'
      meta.textContent = needs.length ? needs.join(' · ') : 'no equipment'
      tags.append(meta)

      const why = document.createElement('p')
      why.className = 'lib-why'
      why.textContent = ex.why

      item.append(top, tags, why)
      nodes.push(item)
    }
  }

  if (!nodes.length) {
    const empty = document.createElement('p')
    empty.className = 'hint'
    empty.textContent = 'Nothing is available on this profile. Turn on a pack or some equipment in Settings.'
    nodes.push(empty)
  }

  $('library').replaceChildren(...nodes)
  void packName
}

$('libOnlyAvailable').addEventListener('change', renderLibrary)

function renderPoolNote () {
  if (!library.length) return
  const short = library.filter((e) => e.availability && e.availability.short).length
  const long = library.filter((e) => e.availability && e.availability.long).length
  $('poolNote').textContent =
    `On "${profile.name}": ${short} exercises can come up in a short break, ${long} in a long one.`
}

// ------------------------------------------------------------------ stats

async function refreshStats () {
  const { today, history } = await window.pomopt.getStats()

  $('statPomos').textContent = today.pomodoros
  $('statBreaks').textContent = today.breaks
  $('statReps').textContent = Object.values(today.exercises).reduce((a, b) => a + b, 0)

  const max = Math.max(1, ...history.map((d) => d.pomodoros))
  $('sparkline').replaceChildren(
    ...history.map((d) => {
      const col = document.createElement('div')
      col.className = 'spark-col'

      const bar = document.createElement('div')
      bar.className = 'spark-bar' + (d.pomodoros === 0 ? ' empty' : '')
      bar.style.height = `${Math.max(3, (d.pomodoros / max) * 100)}%`
      bar.title = `${d.pomodoros} focus blocks, ${d.breaks} breaks`

      const day = document.createElement('div')
      day.className = 'spark-day'
      // Parse as local time; `new Date('YYYY-MM-DD')` would be UTC and can slip a day.
      const [y, m, dd] = d.date.split('-').map(Number)
      day.textContent = new Date(y, m - 1, dd).toLocaleDateString(undefined, { weekday: 'narrow' })

      col.append(bar, day)
      return col
    })
  )

  const entries = Object.entries(today.exercises).sort((a, b) => b[1] - a[1])
  if (entries.length === 0) {
    const li = document.createElement('li')
    li.className = 'log-empty'
    li.textContent = 'Nothing yet today.'
    $('todayList').replaceChildren(li)
  } else {
    $('todayList').replaceChildren(
      ...entries.map(([id, count]) => {
        const ex = library.find((e) => e.id === id)
        const li = document.createElement('li')
        const name = document.createElement('span')
        name.textContent = ex ? ex.name : id
        const n = document.createElement('span')
        n.textContent = `×${count}`
        li.append(name, n)
        return li
      })
    )
  }
}

// --------------------------------------------------------------- settings

const NUMERIC_FIELDS = [
  ['setWork', 'workMinutes'],
  ['setShort', 'shortBreakMinutes'],
  ['setLong', 'longBreakMinutes'],
  ['setEvery', 'longBreakEvery'],
  ['setWarn', 'preBreakWarningSeconds'],
  ['setHoldReminder', 'holdReminderMinutes'],
  ['setHold', 'skipHoldSeconds']
]

const BOOL_FIELDS = [
  ['setAutoBreak', 'autoStartBreak'],
  ['setAutoWork', 'autoStartWork'],
  ['setSound', 'soundEnabled']
]

const INTENSITY_NOTE = {
  low: 'Nothing that leaves you sweaty. Safe for the office.',
  moderate: 'Real effort, but you will not need to change your shirt.',
  high: 'Anything goes, including intervals and jumping.'
}

function fillSettings () {
  for (const [id, key] of NUMERIC_FIELDS) $(id).value = settings[key]
  for (const [id, key] of BOOL_FIELDS) $(id).checked = !!settings[key]

  $('setIntensity').value = profile.maxIntensity
  $('intensityNote').textContent = INTENSITY_NOTE[profile.maxIntensity] || ''
  $('setDumbbell').value = profile.maxDumbbellLb

  renderEquipment()
  renderPacks()
}

function wireSettings () {
  for (const [id, key] of NUMERIC_FIELDS) {
    $(id).addEventListener('change', async (e) => {
      const raw = Number(e.target.value)
      const min = Number(e.target.min)
      const max = Number(e.target.max)
      if (!Number.isFinite(raw)) { e.target.value = settings[key]; return }
      const value = Math.min(max, Math.max(min, raw))
      e.target.value = value
      adoptSettings(await window.pomopt.updateSettings({ [key]: value }))
    })
  }
  for (const [id, key] of BOOL_FIELDS) {
    $(id).addEventListener('change', async (e) => {
      adoptSettings(await window.pomopt.updateSettings({ [key]: e.target.checked }))
    })
  }

  $('setIntensity').addEventListener('change', async (e) => {
    await patchProfile({ maxIntensity: e.target.value })
    $('intensityNote').textContent = INTENSITY_NOTE[profile.maxIntensity] || ''
  })

  $('setDumbbell').addEventListener('change', async (e) => {
    const value = Math.min(200, Math.max(0, Number(e.target.value) || 0))
    e.target.value = value
    await patchProfile({ maxDumbbellLb: value })
  })
}

// -------------------------------------------------------------- bootstrap

function renderAll () {
  fillSettings()
  renderProfileChips()
  refreshLibrary()
}

window.pomopt.onState(renderTimer)

;(async () => {
  const state = await window.pomopt.bootstrap()
  adoptSettings(state.settings)
  catalog = await window.pomopt.getCatalog()
  library = await window.pomopt.getExerciseLibrary()

  renderTimer(state)
  fillSettings()
  wireSettings()
  renderLibrary()
  renderPoolNote()
  refreshStats()
})()
