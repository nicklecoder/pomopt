'use strict'

/**
 * Development helper: asserts the meeting hold and the pre-break warning.
 *
 *   npx electron scripts/hold-test.js
 */

process.env.POMOPT_DEV = '1'

require('./_harness')
require('../src/main/index.js')

const { app, BrowserWindow, ipcMain } = require('electron')

const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const invoke = (channel, ...args) => {
  const handler = ipcMain._invokeHandlers.get(channel)
  return handler ? handler({}, ...args) : undefined
}
const check = (label, ok, detail = '') =>
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? '  (' + detail + ')' : ''}`)

const wins = (frag) =>
  BrowserWindow.getAllWindows().filter((w) => !w.isDestroyed() && w.getURL().includes(frag))
const overlays = () => wins('/break/')
const warnings = () => wins('/warning/')
const state = async () => invoke('app:bootstrap')

async function run () {
  await invoke('settings:update', {
    workMinutes: 4 / 60,
    shortBreakMinutes: 3,
    longBreakEvery: 4,
    autoStartBreak: true,
    autoStartWork: false,
    soundEnabled: false,
    preBreakWarningSeconds: 6,
    holdReminderMinutes: 0
  })

  // ---- the warning fires before a break takes the screen ----------------
  await invoke('timer:startWork')
  await wait(5000)

  let s = await state()
  check('work rolls into a warning, not straight into a break', s.mode === 'warn', s.mode)
  check('warning panel is open', warnings().length === 1, `${warnings().length}`)
  check('no overlay has taken the screen yet', overlays().length === 0)
  check('warning knows which break is coming', !!s.pendingBreakKind, s.pendingBreakKind)

  // ---- holding from the warning ----------------------------------------
  await invoke('hold:begin')
  s = await state()
  check('hold clears the warning panel', warnings().length === 0)
  check('hold reports itself in state', !!s.hold)
  check('timer is idle while held', s.mode === 'idle', s.mode)
  check('the deferred break is remembered', s.hold.owed && s.hold.owed.type === 'break',
    JSON.stringify(s.hold.owed))

  // Nothing may seize the screen while held.
  await wait(2500)
  check('nothing opens while held', overlays().length === 0 && warnings().length === 0)

  // ---- releasing hands the break back ----------------------------------
  await invoke('hold:release')
  await wait(600)
  s = await state()
  check('release starts the break that was owed', s.mode === 'short' || s.mode === 'long', s.mode)
  check('overlay opens on release', overlays().length >= 1)
  check('hold is cleared', !s.hold)

  // ---- holding from inside a running break -----------------------------
  // Sit in the break a while so the remainder is meaningfully shorter than a
  // fresh break — otherwise this passes trivially.
  const fullBreak = (await state()).totalSeconds
  await wait(12000)
  const before = (await state()).remainingSeconds
  await invoke('hold:begin')
  s = await state()
  check('hold closes a running break overlay', overlays().length === 0, `${overlays().length}`)
  const owed = s.hold.owed
  check('you still owe the REMAINDER, not a fresh break',
    owed.type === 'break' &&
      owed.seconds <= Math.ceil(before) + 1 &&
      owed.seconds < fullBreak - 8,
    `owed ${owed.seconds}s — was ${Math.ceil(before)}s left of a ${fullBreak}s break`)

  await invoke('hold:release')
  await wait(600)
  s = await state()
  check('resumed break is the shortened remainder',
    s.totalSeconds <= owed.seconds + 1, `${Math.round(s.totalSeconds)}s`)

  // ---- holding during focus preserves the focus block ------------------
  await invoke('timer:stop')
  await invoke('settings:update', { workMinutes: 25 })
  await invoke('timer:startWork')
  await wait(1500)
  const workLeft = (await state()).remainingSeconds
  await invoke('hold:begin')
  s = await state()
  check('holding during focus remembers the focus block',
    s.hold.owed.type === 'work' && Math.abs(s.hold.owed.seconds - workLeft) < 3,
    `${s.hold.owed.seconds}s vs ${Math.round(workLeft)}s`)

  await invoke('hold:release')
  s = await state()
  check('release returns to focus with its time intact',
    s.mode === 'work' && Math.abs(s.remainingSeconds - workLeft) < 3,
    `${s.mode} ${Math.round(s.remainingSeconds)}s`)

  // ---- explicit actions override a hold --------------------------------
  await invoke('hold:begin')
  check('held again', !!(await state()).hold)
  await invoke('timer:startWork')
  s = await state()
  check('starting focus explicitly clears the hold', !s.hold && s.mode === 'work', s.mode)

  // ---- warning can be disabled -----------------------------------------
  await invoke('timer:stop')
  await invoke('settings:update', { preBreakWarningSeconds: 0, workMinutes: 3 / 60 })
  await invoke('timer:startWork')
  await wait(4200)
  s = await state()
  check('warning off goes straight to the break',
    (s.mode === 'short' || s.mode === 'long') && warnings().length === 0, s.mode)

  await invoke('timer:stop')
}

app.whenReady().then(async () => {
  try {
    await run()
  } catch (err) {
    console.error('FAIL  test harness threw:', err && err.stack ? err.stack : err)
    process.exitCode = 1
  } finally {
    global.__pomoptQuitting = true
    app.quit()
  }
})
