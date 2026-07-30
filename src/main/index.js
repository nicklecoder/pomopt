'use strict'

const { app, ipcMain, Notification, powerMonitor, powerSaveBlocker, globalShortcut } = require('electron')

const store = require('./store')
const windows = require('./windows')
const tray = require('./tray')
const { Timer } = require('./timer')
const { BreakSession } = require('./breakSession')
const { buildBreakPlan, availabilityFor } = require('./scheduler')
const { EXERCISES } = require('../shared/exercises')
const { PACKS, EQUIPMENT, INTENSITY_ORDER } = require('../shared/packs')

const SNOOZE_MINUTES = 5
// Control+Option+M — deliberately obscure so it does not collide with meeting apps.
const HOLD_SHORTCUT = 'Control+Alt+M'

const timer = new Timer()

let session = null // BreakSession while a break is running
let snoozedBreakKind = null // break kind deferred by a snooze
let pendingBreakKind = null // break waiting behind the pre-break warning
let lastSegmentKey = null
let autoPaused = false
let sleepBlockerId = null

/**
 * Meeting hold. While set, the timer is idle and nothing can take the screen.
 * `owed` records what was interrupted so releasing the hold puts you back
 * there — you still owe the break you were pulled out of.
 */
let hold = null
let holdReminder = null
let holdTicker = null

// ---------------------------------------------------------------------------
// Phase control
// ---------------------------------------------------------------------------

function startWork () {
  // Explicitly starting work is intent to come off hold.
  releaseHold({ resume: false })
  const { workMinutes } = store.getSettings()
  endBreakSession()
  timer.startPhase('work', Math.round(workMinutes * 60))
  emitSound('work-start')
}

/**
 * @param {'short'|'long'} kind
 * @param {number} [secondsOverride] shortened duration when resuming a break
 *   that a meeting hold interrupted part-way through.
 */
function startBreak (kind, secondsOverride) {
  releaseHold({ resume: false })
  const settings = store.getSettings()
  const minutes = kind === 'long' ? settings.longBreakMinutes : settings.shortBreakMinutes
  const seconds = secondsOverride || Math.round(minutes * 60)

  pendingBreakKind = null
  windows.closeWarningWindow()

  const plan = buildBreakPlan(kind, seconds, store.getActiveProfile(), store.getRecent())
  session = new BreakSession(kind, plan, seconds)
  lastSegmentKey = null

  timer.startPhase(kind, seconds)
  windows.openBreakWindows()
  blockSleep(true)
  emitSound('break-start')
}

/**
 * Show the pre-break warning instead of grabbing the screen immediately, so a
 * break can never ambush a meeting you forgot to hold for.
 */
function requestBreak (kind) {
  const seconds = Math.round(store.getSettings().preBreakWarningSeconds || 0)
  if (seconds <= 0) {
    startBreak(kind)
    return
  }
  pendingBreakKind = kind
  timer.startPhase('warn', seconds)
  windows.openWarningWindow()
  emitSound('warn')
}

/**
 * Tear down break state without touching the timer.
 * @param {{keepRecent?: boolean}} opts `keepRecent` leaves the rotation history
 *   alone, for a break abandoned rather than performed.
 */
function endBreakSession ({ keepRecent = false } = {}) {
  if (session) {
    if (!keepRecent) {
      const ids = session.exercises.map((e) => e.id)
      if (ids.length) store.pushRecent(ids)
    }
    session = null
  }
  lastSegmentKey = null
  windows.closeBreakWindows()
  blockSleep(false)
}

// ---------------------------------------------------------------------------
// Meeting hold
// ---------------------------------------------------------------------------

function beginHold () {
  if (hold) return
  const s = timer.snapshot()

  let owed = null
  if (s.mode === 'short' || s.mode === 'long') {
    // Credit the time already served; you owe the remainder, not a fresh break.
    owed = { type: 'break', kind: s.mode, seconds: Math.max(45, Math.ceil(s.remainingSeconds)) }
    endBreakSession({ keepRecent: true })
  } else if (s.mode === 'warn') {
    owed = { type: 'break', kind: pendingBreakKind || 'short', seconds: null }
  } else if (s.mode === 'work') {
    owed = { type: 'work', seconds: Math.max(10, Math.ceil(s.remainingSeconds)) }
  }

  pendingBreakKind = null
  windows.closeWarningWindow()
  timer.idle()

  hold = { since: Date.now(), owed }
  startHoldReminder()
  pushState()
  notify('Breaks on hold', 'Nothing will take your screen until you resume.')
}

function releaseHold ({ resume = true } = {}) {
  if (!hold) return
  const { owed } = hold
  hold = null
  stopHoldReminder()

  if (resume && owed) {
    if (owed.type === 'break') startBreak(owed.kind, owed.seconds || undefined)
    else timer.startPhase('work', owed.seconds)
    return
  }
  pushState()
}

function toggleHold () {
  hold ? releaseHold({ resume: true }) : beginHold()
}

function holdMinutes () {
  return hold ? Math.floor((Date.now() - hold.since) / 60000) : 0
}

function startHoldReminder () {
  stopHoldReminder()

  // The timer is idle while held, so nothing else refreshes the elapsed count.
  holdTicker = setInterval(() => {
    if (!hold) return stopHoldReminder()
    pushState()
  }, 30 * 1000)

  const mins = Number(store.getSettings().holdReminderMinutes) || 0
  if (mins <= 0) return
  holdReminder = setInterval(() => {
    if (!hold) return stopHoldReminder()
    notify(
      'Breaks still on hold',
      `${holdMinutes()} minutes so far. Resume when your meeting ends.`
    )
  }, mins * 60 * 1000)
}

function stopHoldReminder () {
  if (holdReminder) clearInterval(holdReminder)
  if (holdTicker) clearInterval(holdTicker)
  holdReminder = null
  holdTicker = null
}

function finishBreak () {
  store.recordBreak()
  emitSound('break-end')
  endBreakSession()

  if (store.getSettings().autoStartWork) {
    startWork()
  } else {
    timer.idle()
    // The overlay has just released the screen. Surface the window rather than
    // leaving the hand-off to a notification banner that is easy to miss —
    // idle renders "Start focus" as the primary button, so this lands on the
    // one action there is to take.
    windows.showMainWindow()
    notify('Break done', 'Back to it when you are ready.')
  }
}

function stopAll () {
  releaseHold({ resume: false })
  endBreakSession()
  snoozedBreakKind = null
  pendingBreakKind = null
  windows.closeWarningWindow()
  timer.idle()
}

function skipPhase () {
  if (timer.mode === 'idle') return
  if (timer.mode === 'warn') {
    // Skipping the warning means "I'm ready, start it now".
    startBreak(pendingBreakKind || 'short')
  } else if (timer.mode === 'work') {
    // Skipping work goes straight to the break it would have earned.
    handleWorkComplete({ counted: false })
  } else {
    finishBreak()
  }
}

function handleWorkComplete ({ counted = true } = {}) {
  // A snoozed break takes priority and does not earn a new pomodoro. It still
  // goes through the warning — a returning snooze must not ambush a meeting
  // either.
  if (snoozedBreakKind) {
    const kind = snoozedBreakKind
    snoozedBreakKind = null
    requestBreak(kind)
    return
  }

  if (counted) {
    timer.countPomodoro()
    store.recordPomodoro()
  }

  const { longBreakEvery, autoStartBreak } = store.getSettings()
  const n = timer.completedPomodoros
  const kind = n > 0 && n % longBreakEvery === 0 ? 'long' : 'short'

  if (autoStartBreak) {
    requestBreak(kind)
  } else {
    timer.idle()
    notify(
      kind === 'long' ? 'Long break earned' : 'Break time',
      'Open PomoPT to start your break.'
    )
  }
}

function snoozeBreak () {
  const mode = timer.mode
  if (mode === 'short' || mode === 'long') snoozedBreakKind = mode
  else if (mode === 'warn') snoozedBreakKind = pendingBreakKind || 'short'
  else return

  pendingBreakKind = null
  windows.closeWarningWindow()
  endBreakSession()
  timer.startPhase('work', SNOOZE_MINUTES * 60)
  notify('Break snoozed', `Back in ${SNOOZE_MINUTES} minutes. Your knee is keeping score.`)
}

// ---------------------------------------------------------------------------
// Timer wiring
// ---------------------------------------------------------------------------

timer.on('complete', (mode) => {
  if (mode === 'work') handleWorkComplete()
  else if (mode === 'warn') startBreak(pendingBreakKind || 'short')
  else finishBreak()
})

/** Refresh the tray and every renderer from the current state. */
function pushState () {
  const snapshot = timer.snapshot()
  tray.update(snapshot, trayActions, trayContext())
  windows.broadcast('state', buildStatePayload(snapshot))
}

function trayContext () {
  const settings = store.getSettings()
  return {
    activeProfile: settings.activeProfile,
    profiles: Object.entries(settings.profiles).map(([key, p]) => ({ key, name: p.name })),
    hold: hold ? { minutes: holdMinutes(), owed: hold.owed } : null,
    pendingBreakKind
  }
}

timer.on('tick', (snapshot) => {
  tray.update(snapshot, trayActions, trayContext())
  windows.broadcast('state', buildStatePayload(snapshot))

  if (session && (snapshot.mode === 'short' || snapshot.mode === 'long')) {
    for (const id of session.harvestCompleted(snapshot.elapsedSeconds)) {
      store.recordExercise(id)
    }
    const view = session.view(snapshot)
    const key = `${view.phase}:${view.exerciseIndex}:${view.side}`
    if (lastSegmentKey !== null && key !== lastSegmentKey) {
      emitSound(view.phase === 'exercise' ? 'segment-start' : 'segment-end')
    }
    lastSegmentKey = key
    windows.broadcast('break:view', view)
  }
})

function buildStatePayload (snapshot) {
  const settings = store.getSettings()
  return {
    ...snapshot,
    settings,
    profile: store.getActiveProfile(),
    today: store.getToday(),
    snoozePending: !!snoozedBreakKind,
    pendingBreakKind,
    hold: hold ? { minutes: holdMinutes(), owed: hold.owed } : null
  }
}

function emitSound (kind) {
  if (!store.getSettings().soundEnabled) return
  windows.broadcast('sound', { kind })
}

function notify (title, body) {
  if (!Notification.isSupported()) return
  new Notification({ title, body, silent: !store.getSettings().soundEnabled }).show()
}

function blockSleep (on) {
  if (on && sleepBlockerId === null) {
    sleepBlockerId = powerSaveBlocker.start('prevent-display-sleep')
  } else if (!on && sleepBlockerId !== null) {
    if (powerSaveBlocker.isStarted(sleepBlockerId)) powerSaveBlocker.stop(sleepBlockerId)
    sleepBlockerId = null
  }
}

const trayActions = {
  startWork,
  startBreak,
  toggle: () => timer.toggle(),
  skipPhase,
  stop: stopAll,
  showMain: () => windows.showMainWindow(),
  activateProfile: (key) => {
    store.setActiveProfile(key)
    pushState()
  },
  beginHold,
  releaseHold: () => releaseHold({ resume: true })
}

// ---------------------------------------------------------------------------
// IPC
// ---------------------------------------------------------------------------

function registerIpc () {
  ipcMain.handle('app:bootstrap', () => ({
    ...buildStatePayload(timer.snapshot()),
    history: store.getHistory(7)
  }))

  ipcMain.handle('stats:get', () => ({
    today: store.getToday(),
    history: store.getHistory(7)
  }))

  ipcMain.handle('exercises:list', () => {
    const availability = availabilityFor(store.getActiveProfile())
    return EXERCISES.map((ex) => ({ ...ex, availability: availability.get(ex.id) }))
  })

  ipcMain.handle('catalog:get', () => ({
    packs: PACKS,
    equipment: EQUIPMENT,
    intensities: INTENSITY_ORDER
  }))

  ipcMain.handle('profile:activate', (_e, key) => {
    const settings = store.setActiveProfile(key)
    pushState()
    return settings
  })
  ipcMain.handle('profile:update', (_e, { key, patch }) => {
    const settings = store.updateProfile(key, patch || {})
    pushState()
    return settings
  })
  ipcMain.handle('profile:add', (_e, { name, copyFrom }) => {
    const settings = store.addProfile(name, copyFrom)
    pushState()
    return settings
  })
  ipcMain.handle('profile:remove', (_e, key) => {
    const settings = store.removeProfile(key)
    pushState()
    return settings
  })

  ipcMain.handle('timer:startWork', () => { startWork() })
  ipcMain.handle('timer:startBreak', (_e, kind) => {
    startBreak(kind === 'long' ? 'long' : 'short')
  })
  ipcMain.handle('timer:toggle', () => { timer.toggle() })
  ipcMain.handle('timer:skipPhase', () => { skipPhase() })
  ipcMain.handle('timer:stop', () => { stopAll() })
  ipcMain.handle('timer:adjust', (_e, seconds) => { timer.adjust(Number(seconds) || 0) })
  ipcMain.handle('timer:resetCycle', () => { timer.resetCycle() })

  ipcMain.handle('break:next', () => {
    if (session) session.skipSegment(timer.elapsedSeconds)
  })
  ipcMain.handle('break:prev', () => {
    if (session) session.previousSegment(timer.elapsedSeconds)
  })
  ipcMain.handle('break:end', () => { finishBreak() })
  ipcMain.handle('break:snooze', () => { snoozeBreak() })
  ipcMain.handle('break:startNow', () => { startBreak(pendingBreakKind || 'short') })

  ipcMain.handle('hold:begin', () => { beginHold() })
  ipcMain.handle('hold:release', () => { releaseHold({ resume: true }) })
  ipcMain.handle('hold:cancel', () => { releaseHold({ resume: false }) })

  ipcMain.handle('settings:update', (_e, patch) => store.setSettings(patch || {}))
}

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------

const gotLock = app.requestSingleInstanceLock()
if (!gotLock) {
  app.quit()
} else {
  app.on('second-instance', () => windows.showMainWindow())

  app.whenReady().then(() => {
    registerIpc()
    tray.createTray(trayActions, trayContext())
    windows.createMainWindow()

    // Sleeping the laptop should not burn through a focus block.
    powerMonitor.on('suspend', () => {
      if (timer.mode !== 'idle' && timer.running) {
        timer.pause()
        autoPaused = true
      }
    })
    powerMonitor.on('resume', () => {
      if (autoPaused) {
        autoPaused = false
        timer.resume()
      }
    })

    // A break overlay that lands mid-meeting needs killing faster than you can
    // find the menu bar, so the hold gets a global shortcut.
    try {
      const ok = globalShortcut.register(HOLD_SHORTCUT, toggleHold)
      if (!ok) console.warn(`[pomopt] could not register ${HOLD_SHORTCUT} (already taken)`)
    } catch (err) {
      console.warn('[pomopt] global shortcut unavailable:', err.message)
    }

    app.on('activate', () => windows.showMainWindow())

    // POMOPT_DEV_BREAK=short|long jumps straight into a break at launch.
    const devBreak = process.env.POMOPT_DEV_BREAK
    if (devBreak === 'short' || devBreak === 'long') {
      setTimeout(() => startBreak(devBreak), 400)
    }
  })

  // Menu-bar app: closing the window does not quit.
  app.on('window-all-closed', () => {})

  app.on('before-quit', () => {
    global.__pomoptQuitting = true
    blockSleep(false)
    stopHoldReminder()
    globalShortcut.unregisterAll()
    store.flush()
  })
}
