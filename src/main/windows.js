'use strict'

const path = require('path')
const { app, BrowserWindow, screen } = require('electron')

const PRELOAD = path.join(__dirname, 'preload.js')

// POMOPT_DEV=1 renders break overlays as ordinary resizable windows on the
// primary display only, so the break UI can be worked on without the app
// seizing every screen you own.
const DEV = process.env.POMOPT_DEV === '1'

let mainWindow = null
let breakWindows = []
let warningWindow = null

function createMainWindow () {
  if (mainWindow && !mainWindow.isDestroyed()) return mainWindow

  mainWindow = new BrowserWindow({
    width: 460,
    height: 720,
    minWidth: 400,
    minHeight: 560,
    show: false,
    title: 'PomoPT',
    backgroundColor: '#0e1116',
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      preload: PRELOAD,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  })

  mainWindow.loadFile(path.join(__dirname, '../renderer/main/index.html'))
  mainWindow.once('ready-to-show', () => mainWindow.show())

  // Closing the window just hides it — the app lives in the menu bar.
  mainWindow.on('close', (e) => {
    if (!global.__pomoptQuitting) {
      e.preventDefault()
      mainWindow.hide()
    }
  })

  return mainWindow
}

function showMainWindow () {
  const win = createMainWindow()
  if (win.isMinimized()) win.restore()
  win.show()
  // On macOS `win.focus()` will not raise a window whose app is not already
  // frontmost, which is exactly the state left behind when the break overlays
  // are destroyed and the app is briefly down to no visible windows.
  if (process.platform === 'darwin') app.focus({ steal: true })
  win.focus()
}

function getMainWindow () {
  return mainWindow && !mainWindow.isDestroyed() ? mainWindow : null
}

/**
 * One full-screen overlay per display. Every window renders the same state;
 * the main process is the single source of truth, so input from any screen
 * drives all of them.
 */
function openBreakWindows () {
  closeBreakWindows()

  const displays = DEV ? [screen.getPrimaryDisplay()] : screen.getAllDisplays()
  const primaryId = screen.getPrimaryDisplay().id

  breakWindows = displays.map((display) => {
    const win = new BrowserWindow({
      ...(DEV
        ? { width: 1280, height: 820, resizable: true, movable: true, frame: true }
        : {
            x: display.bounds.x,
            y: display.bounds.y,
            width: display.bounds.width,
            height: display.bounds.height,
            frame: false,
            resizable: false,
            movable: false
          }),
      minimizable: false,
      maximizable: false,
      fullscreenable: false,
      skipTaskbar: true,
      show: false,
      backgroundColor: '#0b0e13',
      webPreferences: {
        preload: PRELOAD,
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: false,
        additionalArguments: [
          `--pomopt-primary=${display.id === primaryId ? '1' : '0'}`
        ]
      }
    })

    win.loadFile(path.join(__dirname, '../renderer/break/index.html'))

    if (!DEV) {
      // Float above everything, including other apps' full-screen spaces.
      win.setAlwaysOnTop(true, 'screen-saver')
      win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreenScreens: true })
    }

    win.once('ready-to-show', () => {
      win.show()
      if (display.id === primaryId) win.focus()
    })

    return win
  })

  return breakWindows
}

function closeBreakWindows () {
  for (const win of breakWindows) {
    if (win && !win.isDestroyed()) win.destroy()
  }
  breakWindows = []
}

function hasBreakWindows () {
  return breakWindows.some((w) => w && !w.isDestroyed())
}

/**
 * The pre-break warning: a small panel in the corner of the primary display,
 * shown before a break takes over. It floats above other apps but is opened
 * without focus, so it never steals a keystroke from whatever you are doing.
 */
function openWarningWindow () {
  if (warningWindow && !warningWindow.isDestroyed()) return warningWindow

  const display = screen.getPrimaryDisplay()
  const w = 420
  const h = 196
  const margin = 24

  warningWindow = new BrowserWindow({
    width: w,
    height: h,
    x: display.workArea.x + display.workArea.width - w - margin,
    y: display.workArea.y + display.workArea.height - h - margin,
    frame: false,
    resizable: false,
    movable: true,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    skipTaskbar: true,
    show: false,
    backgroundColor: '#0e1116',
    webPreferences: {
      preload: PRELOAD,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  })

  warningWindow.loadFile(path.join(__dirname, '../renderer/warning/index.html'))

  if (!DEV) {
    warningWindow.setAlwaysOnTop(true, 'screen-saver')
    warningWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreenScreens: true })
  }

  // showInactive: visible and clickable, but does not pull focus mid-sentence.
  warningWindow.once('ready-to-show', () => warningWindow.showInactive())

  return warningWindow
}

function closeWarningWindow () {
  if (warningWindow && !warningWindow.isDestroyed()) warningWindow.destroy()
  warningWindow = null
}

function hasWarningWindow () {
  return !!(warningWindow && !warningWindow.isDestroyed())
}

function broadcast (channel, payload) {
  const targets = [...breakWindows, warningWindow, mainWindow]
  for (const win of targets) {
    if (win && !win.isDestroyed()) {
      win.webContents.send(channel, payload)
    }
  }
}

module.exports = {
  createMainWindow,
  showMainWindow,
  getMainWindow,
  openBreakWindows,
  closeBreakWindows,
  hasBreakWindows,
  openWarningWindow,
  closeWarningWindow,
  hasWarningWindow,
  broadcast
}
