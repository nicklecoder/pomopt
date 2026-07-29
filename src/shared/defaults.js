'use strict'

const { PACKS, EQUIPMENT_IDS } = require('./packs')

/**
 * A profile is "what is available to me right now": which equipment exists,
 * which packs are running, how hard you are willing to work, and how heavy your
 * dumbbells go. Switching profile switches all of that at once, which is the
 * point — Office and Home are different gyms.
 */

function packMap (enabledPackIds) {
  const out = {}
  for (const pack of PACKS) {
    out[pack.id] = {
      enabled: enabledPackIds === null || enabledPackIds.includes(pack.id),
      // Anchor packs get a guaranteed slot in every break.
      anchor: !!pack.anchorByDefault,
      groups: Object.fromEntries(pack.groups.map((g) => [g.id, true]))
    }
  }
  return out
}

function equipmentMap (availableIds) {
  return Object.fromEntries(EQUIPMENT_IDS.map((id) => [id, availableIds.includes(id)]))
}

const DEFAULT_PROFILES = {
  home: {
    name: 'Home',
    maxIntensity: 'high',
    maxDumbbellLb: 52.5,
    equipment: equipmentMap([
      'desk', 'wall', 'chair', 'step', 'floor', 'mat',
      'dumbbells', 'bench', 'benchIncline', 'curlPlatform',
      'kettlebellHandle', 'abRoller',
      'bikeMachine', 'bikeOutdoor'
    ]),
    packs: packMap(null)
  },
  office: {
    name: 'Office',
    // Nothing that leaves you sweaty before a meeting.
    maxIntensity: 'low',
    maxDumbbellLb: 0,
    equipment: equipmentMap(['desk', 'wall', 'chair', 'step']),
    packs: packMap(['knee-pt', 'stretch'])
  }
}

const DEFAULT_SETTINGS = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakEvery: 4,

  // Auto-start the next work block when a break ends. Off by default so you
  // decide when to re-enter focus.
  autoStartWork: false,
  // Auto-start the break when a work block ends. On by default — the whole
  // point is that you do not get to decide in the moment.
  autoStartBreak: true,

  soundEnabled: true,
  // Seconds you must hold the skip button before a break can be ended early.
  skipHoldSeconds: 2,

  // A small panel appears this many seconds before a break takes the screen, so
  // a break can never ambush a screen share. 0 disables it.
  preBreakWarningSeconds: 20,
  // While breaks are held for a meeting, nudge this often so a hold cannot
  // quietly swallow the rest of the day. 0 disables it.
  holdReminderMinutes: 20,

  activeProfile: 'home',
  profiles: DEFAULT_PROFILES
}

module.exports = { DEFAULT_SETTINGS, DEFAULT_PROFILES, packMap, equipmentMap }
