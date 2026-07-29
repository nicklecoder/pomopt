'use strict'

const { PACK_BY_ID, EQUIPMENT_IDS, INTENSITY_ORDER } = require('../packs')

const EXERCISES = [
  ...require('./knee'),
  ...require('./upper'),
  ...require('./core'),
  ...require('./lower'),
  ...require('./stretch'),
  ...require('./cardio'),
  ...require('./yoga')
]

const BY_ID = new Map(EXERCISES.map((e) => [e.id, e]))

const REQUIRED = ['id', 'name', 'pack', 'groups', 'equipment', 'setting', 'position', 'intensity', 'seconds', 'dose', 'why', 'cues']
const SETTINGS = ['desk', 'space']
// 'floor' means down on the ground; 'bench' means lying on a weight bench.
// Both are "you are not going to do this in a five-minute desk break".
const POSITIONS = ['standing', 'seated', 'floor', 'bench']

/**
 * Check the library against the pack and equipment catalogues. There is enough
 * hand-written data here that a typo in a group or equipment id would silently
 * make an exercise unschedulable, so this is run by the test scripts.
 *
 * @returns {string[]} problems found; empty means the library is consistent.
 */
function validate () {
  const problems = []
  const seen = new Set()

  for (const ex of EXERCISES) {
    const where = ex.id || ex.name || '(unnamed)'

    for (const field of REQUIRED) {
      if (ex[field] === undefined || ex[field] === null) {
        problems.push(`${where}: missing "${field}"`)
      }
    }
    if (seen.has(ex.id)) problems.push(`${where}: duplicate id`)
    seen.add(ex.id)

    const pack = PACK_BY_ID.get(ex.pack)
    if (!pack) {
      problems.push(`${where}: unknown pack "${ex.pack}"`)
    } else {
      const groupIds = new Set(pack.groups.map((g) => g.id))
      for (const g of ex.groups || []) {
        if (!groupIds.has(g)) problems.push(`${where}: group "${g}" is not in pack "${ex.pack}"`)
      }
      if (!ex.groups || ex.groups.length === 0) problems.push(`${where}: no groups`)
    }

    for (const eq of ex.equipment || []) {
      if (!EQUIPMENT_IDS.includes(eq)) problems.push(`${where}: unknown equipment "${eq}"`)
    }
    if (ex.minWeightLb !== undefined && !(ex.equipment || []).includes('dumbbells')) {
      problems.push(`${where}: minWeightLb without dumbbells`)
    }
    if (!SETTINGS.includes(ex.setting)) problems.push(`${where}: bad setting "${ex.setting}"`)
    if (!POSITIONS.includes(ex.position)) problems.push(`${where}: bad position "${ex.position}"`)
    if (!INTENSITY_ORDER.includes(ex.intensity)) problems.push(`${where}: bad intensity "${ex.intensity}"`)
    if (ex.position === 'floor' && !(ex.equipment || []).includes('floor')) {
      problems.push(`${where}: floor position must require "floor" equipment`)
    }
    if (ex.position === 'bench' && !(ex.equipment || []).includes('bench')) {
      problems.push(`${where}: bench position must require "bench" equipment`)
    }
    if (!Array.isArray(ex.cues) || ex.cues.length < 3) {
      problems.push(`${where}: needs at least 3 cues`)
    }
  }

  return problems
}

module.exports = { EXERCISES, BY_ID, validate }
