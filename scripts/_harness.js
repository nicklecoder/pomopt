'use strict'

/**
 * Shared setup for the dev scripts.
 *
 * `electron scripts/foo.js` makes Electron treat `scripts/` as the app root.
 * There is no package.json there, so the app name falls back to "Electron" and
 * userData resolves to a directory shared with every other Electron app on the
 * machine — including previous runs of these very scripts. That let one test's
 * settings changes leak into the next run.
 *
 * Every script requires this FIRST, before src/main/index.js, so each run gets
 * a throwaway userData directory and starts from real defaults.
 */

const fs = require('fs')
const os = require('os')
const path = require('path')
const { app } = require('electron')

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pomopt-test-'))
app.setPath('userData', dir)

app.on('will-quit', () => {
  try {
    fs.rmSync(dir, { recursive: true, force: true })
  } catch { /* a leftover temp dir is not worth failing over */ }
})

module.exports = { userDataDir: dir }
