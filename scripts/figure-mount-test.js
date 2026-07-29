/**
 * Development helper: asserts every exercise mounts an animated figure with a
 * caption in the real break overlay.
 *
 *   npx electron scripts/figure-mount-test.js
 */

// Verify the LIVE break overlay mounts an animated figure with a caption for
// every exercise — the contact sheet only exercises createStatic.
process.env.POMOPT_DEV = '1'
process.env.POMOPT_DEV_BREAK = 'long'
require('./_harness')
require('../src/main/index.js')
const { app, BrowserWindow } = require('electron')
const { EXERCISES } = require('../src/shared/exercises')
const wait = ms => new Promise(r => setTimeout(r, ms))
app.whenReady().then(async () => {
  await wait(2000)
  const win = BrowserWindow.getAllWindows().find(w => w.getURL().includes('/break/'))
  const res = await win.webContents.executeJavaScript(`
    (() => {
      const ids = ${JSON.stringify(EXERCISES.map(e => e.id))}
      const out = { ok: 0, failed: [] }
      const slot = document.getElementById('figureSlot')
      for (const id of ids) {
        try {
          const f = window.PomoptFigures.createFigure(id)
          if (!f) { out.failed.push(id + ' (null)'); continue }
          slot.replaceChildren(f.el)
          const n = f.el.querySelector('svg').childElementCount
          const cap = f.el.querySelector('figcaption').textContent
          f.destroy()
          if (n < 4) out.failed.push(id + ' (' + n + ' elements)')
          else if (!cap) out.failed.push(id + ' (no caption)')
          else out.ok++
        } catch (e) { out.failed.push(id + ' :: ' + e.message) }
      }
      return out
    })()`)
  console.log('live figures with caption: ' + res.ok + ' / ' + EXERCISES.length)
  console.log(res.failed.length ? 'FAILED:\n  ' + res.failed.join('\n  ')
    : 'every exercise mounts an animated figure in the real overlay')
  global.__pomoptQuitting = true
  app.quit()
})
