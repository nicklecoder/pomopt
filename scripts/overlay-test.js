'use strict'

/**
 * Development helper: verifies break overlays open when a break starts, close
 * when it ends, and that finished exercises reach the daily log.
 *
 *   npx electron scripts/overlay-test.js
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
const overlays = () =>
  BrowserWindow.getAllWindows().filter((w) => !w.isDestroyed() && w.getURL().includes('/break/'))
const mainWin = () =>
  BrowserWindow.getAllWindows().find((w) => !w.isDestroyed() && w.getURL().includes('/main/'))

const check = (label, ok, detail = '') =>
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? '  (' + detail + ')' : ''}`)

app.whenReady().then(async () => {
  await invoke('settings:update', {
    workMinutes: 4 / 60,
    shortBreakMinutes: 80 / 60,
    longBreakEvery: 4,
    autoStartBreak: true,
    autoStartWork: false,
    soundEnabled: false,
    // This suite is about overlay lifecycle; the warning has its own test.
    preBreakWarningSeconds: 0
  })

  const before = (await invoke('stats:get')).today

  check('no overlays while idle', overlays().length === 0)

  await invoke('timer:startWork')
  await wait(600)
  check('no overlays during focus', overlays().length === 0)

  // Sit the way a menu-bar app usually sits — window put away. The hand-off at
  // the end of the break has to bring it back on its own.
  mainWin().hide()
  check('main window hidden during focus', !mainWin().isVisible())

  // Wait out the 4s focus block; the break should auto-open.
  await wait(4500)
  const during = overlays()
  check('overlay opens when break starts', during.length >= 1, `${during.length} window(s)`)

  const view = await during[0].webContents.executeJavaScript(
    `({ title: document.getElementById('interTitle').textContent,
        kind: document.getElementById('kind').textContent,
        dots: document.querySelectorAll('.dot').length,
        interVisible: !document.getElementById('interstitial').hidden,
        exVisible: !document.getElementById('exercise').hidden })`
  )
  check('overlay rendered the plan', view.dots > 0 && view.title.length > 0, JSON.stringify(view))
  check('exactly one stage visible', view.interVisible !== view.exVisible)

  // Transition is 8s, so by t~14s we are inside the first exercise.
  await wait(9000)
  const exView = await overlays()[0].webContents.executeJavaScript(
    `({ name: document.getElementById('exName').textContent,
        cues: document.querySelectorAll('#cues li').length,
        interVisible: !document.getElementById('interstitial').hidden,
        exVisible: !document.getElementById('exercise').hidden })`
  )
  check('exercise card shows with cues', exView.exVisible && exView.cues > 0, JSON.stringify(exView))
  check('interstitial hidden during exercise', !exView.interVisible)

  // Let the break finish.
  await wait(72000)
  check('overlays close when break ends', overlays().length === 0, `${overlays().length} left`)

  const state = await invoke('app:bootstrap')
  check('returns to idle (autoStartWork off)', state.mode === 'idle', state.mode)
  check('main window surfaces when the break ends', mainWin().isVisible())

  const after = (await invoke('stats:get')).today
  const newExercises = Object.entries(after.exercises).filter(
    ([id, n]) => n > (before.exercises[id] || 0)
  )
  check('completed exercise reached the log', newExercises.length > 0, JSON.stringify(newExercises))
  check('break counted', after.breaks === before.breaks + 1, `${before.breaks} -> ${after.breaks}`)

  global.__pomoptQuitting = true
  app.quit()
})
