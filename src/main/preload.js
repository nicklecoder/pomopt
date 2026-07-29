'use strict'

const { contextBridge, ipcRenderer } = require('electron')

const isPrimary = process.argv.some((a) => a === '--pomopt-primary=1')

const listen = (channel) => (cb) => {
  const handler = (_e, payload) => cb(payload)
  ipcRenderer.on(channel, handler)
  return () => ipcRenderer.removeListener(channel, handler)
}

contextBridge.exposeInMainWorld('pomopt', {
  isPrimaryDisplay: isPrimary,

  // --- queries -----------------------------------------------------------
  bootstrap: () => ipcRenderer.invoke('app:bootstrap'),
  getStats: () => ipcRenderer.invoke('stats:get'),
  getExerciseLibrary: () => ipcRenderer.invoke('exercises:list'),
  getCatalog: () => ipcRenderer.invoke('catalog:get'),

  // --- profiles ----------------------------------------------------------
  activateProfile: (key) => ipcRenderer.invoke('profile:activate', key),
  updateProfile: (key, patch) => ipcRenderer.invoke('profile:update', { key, patch }),
  addProfile: (name, copyFrom) => ipcRenderer.invoke('profile:add', { name, copyFrom }),
  removeProfile: (key) => ipcRenderer.invoke('profile:remove', key),

  // --- timer commands ----------------------------------------------------
  startWork: () => ipcRenderer.invoke('timer:startWork'),
  startBreak: (kind) => ipcRenderer.invoke('timer:startBreak', kind),
  toggle: () => ipcRenderer.invoke('timer:toggle'),
  skipPhase: () => ipcRenderer.invoke('timer:skipPhase'),
  stop: () => ipcRenderer.invoke('timer:stop'),
  adjust: (seconds) => ipcRenderer.invoke('timer:adjust', seconds),
  resetCycle: () => ipcRenderer.invoke('timer:resetCycle'),

  // --- break commands ----------------------------------------------------
  nextSegment: () => ipcRenderer.invoke('break:next'),
  prevSegment: () => ipcRenderer.invoke('break:prev'),
  endBreak: () => ipcRenderer.invoke('break:end'),
  snoozeBreak: () => ipcRenderer.invoke('break:snooze'),
  startBreakNow: () => ipcRenderer.invoke('break:startNow'),

  // --- meeting hold ------------------------------------------------------
  beginHold: () => ipcRenderer.invoke('hold:begin'),
  releaseHold: () => ipcRenderer.invoke('hold:release'),
  cancelHold: () => ipcRenderer.invoke('hold:cancel'),

  // --- settings ----------------------------------------------------------
  updateSettings: (patch) => ipcRenderer.invoke('settings:update', patch),

  // --- events ------------------------------------------------------------
  onState: listen('state'),
  onBreakView: listen('break:view'),
  onSound: listen('sound')
})
