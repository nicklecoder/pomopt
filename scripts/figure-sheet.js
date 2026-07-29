'use strict'

/**
 * Development helper: renders every exercise diagram at both poses and writes
 * the contact sheet to PNG, so the figures can be reviewed in one pass.
 *
 *   npx electron scripts/figure-sheet.js <outDir>
 */

const fs = require('fs')
const path = require('path')
const { app, BrowserWindow } = require('electron')

const outDir = process.argv[2] || path.join(__dirname, '..', '.shots')
const only = process.argv[3] // optional comma-separated exercise ids

app.whenReady().then(async () => {
  fs.mkdirSync(outDir, { recursive: true })

  const win = new BrowserWindow({
    width: 1500,
    height: 1200,
    show: false,
    backgroundColor: '#0b0e13',
    webPreferences: { offscreen: false }
  })

  await win.loadFile(path.join(__dirname, 'figures-preview.html'), {
    search: only ? `only=${only}` : undefined
  })
  await new Promise((r) => setTimeout(r, 900))

  // Capture the sheet as scrolled viewport slices — reliable, and each slice
  // stays legible instead of being one enormous image.
  const height = await win.webContents.executeJavaScript(
    'document.documentElement.scrollHeight'
  )
  const slices = Math.ceil(height / 1150)
  for (let i = 0; i < slices; i++) {
    await win.webContents.executeJavaScript(`window.scrollTo(0, ${i * 1150})`)
    await new Promise((r) => setTimeout(r, 400))
    const img = await win.webContents.capturePage()
    const file = path.join(outDir, `figures-${i + 1}.png`)
    fs.writeFileSync(file, img.toPNG())
    console.log('wrote ' + file)
  }

  app.quit()
})
