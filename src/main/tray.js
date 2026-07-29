'use strict'

const { Tray, Menu, nativeImage, app } = require('electron')

let tray = null

function formatClock (seconds) {
  const s = Math.max(0, Math.ceil(seconds))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${String(r).padStart(2, '0')}`
}

const MODE_GLYPH = {
  idle: '○',
  work: '●',
  warn: '◔',
  short: '◐',
  long: '◑'
}

function createTray (actions, context) {
  if (tray) return tray

  // Title-only tray item: an empty template image keeps macOS happy while the
  // countdown itself carries the information.
  tray = new Tray(nativeImage.createEmpty())
  tray.setToolTip('Pomopt')
  tray.on('click', () => tray.popUpContextMenu())

  update({ mode: 'idle', running: false, remainingSeconds: 0, completedPomodoros: 0 }, actions, context)
  return tray
}

function update (state, actions, context = { profiles: [], activeProfile: null }) {
  if (!tray) return

  const onHold = !!context.hold

  const glyph = MODE_GLYPH[state.mode] || '○'
  const label = onHold
    ? '⏸ Hold'
    : state.mode === 'idle'
      ? `${glyph} Pomopt`
      : `${glyph} ${formatClock(state.remainingSeconds)}${state.running ? '' : ' ⏸'}`

  tray.setTitle(label)

  const modeLabel = {
    idle: 'Idle',
    work: 'Focus',
    warn: 'Break incoming',
    short: 'Short break',
    long: 'Long break'
  }[state.mode]

  const active = (context.profiles || []).find((p) => p.key === context.activeProfile)

  const owedLabel = onHold && context.hold.owed
    ? context.hold.owed.type === 'break'
      ? ' and take the break you owe'
      : ' and carry on'
    : ''

  const menu = Menu.buildFromTemplate([
    onHold
      ? { label: `On hold — ${context.hold.minutes} min`, enabled: false }
      : { label: `${modeLabel} — ${state.completedPomodoros} done this cycle`, enabled: false },
    ...(active ? [{ label: `Profile: ${active.name}`, enabled: false }] : []),
    { type: 'separator' },
    // Meeting hold sits at the top: when a break has just seized a screen share
    // this is the item you are hunting for.
    onHold
      ? { label: `Resume${owedLabel}`, click: actions.releaseHold, accelerator: 'Control+Alt+M' }
      : { label: "I'm in a meeting — hold breaks", click: actions.beginHold, accelerator: 'Control+Alt+M' },
    { type: 'separator' },
    ...(onHold
      ? []
      : state.mode === 'idle'
        ? [{ label: 'Start focus', click: actions.startWork }]
        : [
            { label: state.running ? 'Pause' : 'Resume', click: actions.toggle },
            { label: 'Skip to next phase', click: actions.skipPhase },
            { label: 'Stop', click: actions.stop }
          ]),
    ...(onHold ? [] : [{ type: 'separator' }]),
    { label: 'Take a short break now', click: () => actions.startBreak('short') },
    { label: 'Take a long break now', click: () => actions.startBreak('long') },
    { type: 'separator' },
    // Switching where you are changes the whole available exercise set, so it
    // belongs one click away rather than buried in settings.
    {
      label: 'Where you are',
      submenu: (context.profiles || []).map((p) => ({
        label: p.name,
        type: 'radio',
        checked: p.key === context.activeProfile,
        click: () => actions.activateProfile(p.key)
      }))
    },
    { type: 'separator' },
    { label: 'Open Pomopt', click: actions.showMain },
    { label: 'Quit', click: () => { global.__pomoptQuitting = true; app.quit() } }
  ])

  tray.setContextMenu(menu)
}

module.exports = { createTray, update, formatClock }
