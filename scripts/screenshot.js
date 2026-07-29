'use strict'

/**
 * Development helper: boots the real app in windowed dev mode and writes PNGs
 * of each screen so the UI can be reviewed without a screen-recording grant.
 *
 *   npx electron scripts/screenshot.js <outDir> [short|long]
 */

const fs = require('fs')
const path = require('path')

const outDir = process.argv[2] || path.join(__dirname, '..', '.shots')
const kind = process.argv[3] === 'long' ? 'long' : 'short'

process.env.POMOPT_DEV = '1'
process.env.POMOPT_DEV_BREAK = kind

require('./_harness')
require('../src/main/index.js')

const { app, BrowserWindow } = require('electron')

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

function breakWindow () {
  return BrowserWindow.getAllWindows().find((w) => w.getURL().includes('/break/'))
}
function mainWindow () {
  return BrowserWindow.getAllWindows().find((w) => w.getURL().includes('/main/'))
}

async function shoot (win, name) {
  if (!win || win.isDestroyed()) {
    console.log(`skip ${name}: no window`)
    return
  }
  const img = await win.webContents.capturePage()
  const file = path.join(outDir, `${name}.png`)
  fs.writeFileSync(file, img.toPNG())
  console.log(`wrote ${file}`)
}

app.whenReady().then(async () => {
  fs.mkdirSync(outDir, { recursive: true })
  await wait(1800)

  // Break: the "next up" interstitial runs for the first 8 seconds.
  await shoot(breakWindow(), '1-break-transition')

  // Then the exercise card itself.
  await wait(8000)
  await shoot(breakWindow(), '2-break-exercise')

  // Main window tabs.
  const main = mainWindow()
  if (main) {
    main.show()
    for (const [tab, name] of [
      ['timer', '3-main-timer'],
      ['today', '4-main-today'],
      ['library', '5-main-library'],
      ['settings', '6-main-settings']
    ]) {
      await main.webContents.executeJavaScript(
        `document.querySelector('.tab[data-tab="${tab}"]').click()`
      )
      await wait(350)
      await shoot(main, name)

      // Long panels get a second shot further down.
      const panel = `document.getElementById('panel-${tab}')`
      const scrollable = await main.webContents.executeJavaScript(
        `${panel}.scrollHeight - ${panel}.clientHeight`
      )
      if (scrollable > 200) {
        await main.webContents.executeJavaScript(
          `${panel}.scrollTop = ${tab === 'settings' ? 900 : 500}`
        )
        await wait(300)
        await shoot(main, `${name}-scrolled`)
        await main.webContents.executeJavaScript(`${panel}.scrollTop = 0`)
      }
    }
  }

  global.__pomoptQuitting = true
  app.quit()
})
