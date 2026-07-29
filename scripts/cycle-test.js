'use strict'

/**
 * Development helper: drives the real app through several work/break cycles at
 * a few seconds per phase, so the phase machine, the long-break cadence and
 * the daily log can be checked without waiting two hours.
 *
 *   npx electron scripts/cycle-test.js
 */

process.env.POMOPT_DEV = '1'

require('./_harness')
require('../src/main/index.js')

const { app, BrowserWindow, ipcMain } = require('electron')

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

app.whenReady().then(async () => {
  // Tiny phases: 3s focus, 2s short break, 3s long break, long every 3.
  const invoke = async (channel, ...args) => {
    const handler = ipcMain._invokeHandlers.get(channel)
    return handler ? handler({}, ...args) : undefined
  }

  await invoke('settings:update', {
    workMinutes: 3 / 60,
    shortBreakMinutes: 2 / 60,
    longBreakMinutes: 3 / 60,
    longBreakEvery: 3,
    autoStartBreak: true,
    autoStartWork: true,
    soundEnabled: false,
    // Keep the warning in the loop but tiny, so several cycles fit.
    preBreakWarningSeconds: 1
  })

  const seen = []
  let last = null
  const poll = setInterval(async () => {
    const s = await invoke('app:bootstrap')
    const tag = `${s.mode}${s.running ? '' : ':paused'}`
    if (tag !== last) {
      last = tag
      seen.push(s.mode)
      const overlays = BrowserWindow.getAllWindows().filter((w) => w.getURL().includes('/break/')).length
      console.log(
        `${String(seen.length).padStart(2)}. ${s.mode.padEnd(6)} ` +
        `pomos=${s.completedPomodoros} overlays=${overlays} ` +
        `today={p:${s.today.pomodoros},b:${s.today.breaks}}`
      )
    }
  }, 60)

  await invoke('timer:startWork')
  await wait(26000)

  clearInterval(poll)

  const final = await invoke('app:bootstrap')
  const stats = await invoke('stats:get')
  console.log('\nphase order:', seen.join(' -> '))
  console.log('long breaks seen:', seen.filter((m) => m === 'long').length)
  console.log('logged exercises:', JSON.stringify(stats.today.exercises))
  console.log('final:', JSON.stringify({ pomodoros: final.today.pomodoros, breaks: final.today.breaks }))

  global.__pomoptQuitting = true
  app.quit()
})
