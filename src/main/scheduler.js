'use strict'

const { EXERCISES, BY_ID } = require('../shared/exercises')
const { PACKS, withinIntensity } = require('../shared/packs')

const TRANSITION_SECONDS = 8 // "next up" card before each exercise
const SIDE_SWITCH_SECONDS = 5 // pause between left and right
const TAIL_BUFFER_SECONDS = 10 // don't schedule right up to the last second
const COOLDOWN = 8 // recent picks that are hard-excluded from the next break

// Extra breathing room after a hard set, folded into the following transition.
const REST_AFTER = { low: 0, moderate: 10, high: 20 }

/**
 * Can this exercise run right now, under this profile, in this kind of break?
 */
function isAvailable (ex, profile, kind) {
  const packCfg = profile.packs[ex.pack]
  if (!packCfg || !packCfg.enabled) return false

  // At least one of the exercise's groups must be switched on.
  if (!ex.groups.some((g) => packCfg.groups[g])) return false

  if (!withinIntensity(ex.intensity, profile.maxIntensity)) return false

  for (const eq of ex.equipment) {
    if (!profile.equipment[eq]) return false
  }
  if (ex.minWeightLb && (profile.maxDumbbellLb || 0) < ex.minWeightLb) return false

  // A short break happens where you stand. Anything needing the floor, a bench
  // or a trip to the garage is long-break-only.
  if (kind === 'short' && ex.setting !== 'desk') return false

  return true
}

/**
 * Recency weight: an exercise seen at the very end of the `recent` list is
 * heavily penalised; one not seen at all gets full weight.
 */
function weightFor (ex, recent) {
  const idx = recent.lastIndexOf(ex.id)
  if (idx === -1) return 1
  const stepsAgo = recent.length - idx
  return Math.min(1, stepsAgo / (recent.length + 1)) * 0.6
}

function weightedPick (pool, recent) {
  if (pool.length === 0) return null
  const weights = pool.map((ex) => Math.max(0.02, weightFor(ex, recent)))
  const total = weights.reduce((a, b) => a + b, 0)
  let roll = Math.random() * total
  for (let i = 0; i < pool.length; i++) {
    roll -= weights[i]
    if (roll <= 0) return pool[i]
  }
  return pool[pool.length - 1]
}

function costOf (ex) {
  const sides = ex.perSide ? 2 : 1
  const switches = ex.perSide ? SIDE_SWITCH_SECONDS : 0
  return TRANSITION_SECONDS + REST_AFTER[ex.intensity] + sides * ex.seconds + switches
}

/** How long ago this pack/group last came up; Infinity means never. */
function groupDistance (packId, groupId, recent) {
  for (let i = recent.length - 1; i >= 0; i--) {
    const ex = BY_ID.get(recent[i])
    if (ex && ex.pack === packId && ex.groups.includes(groupId)) return recent.length - i
  }
  return Infinity
}

function shuffled (arr) {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/**
 * Build the order of packs we will try to draw from.
 *
 * Anchor packs (the knee program by default) come first and get one slot per
 * enabled group, so a break still reliably covers both hyperextension and
 * out-toeing rather than landing on two of the same. Everything else is
 * interleaved afterwards.
 */
function buildSlots (profile, kind, recent) {
  const enabled = PACKS.filter((p) => profile.packs[p.id] && profile.packs[p.id].enabled)
  const anchors = enabled.filter((p) => profile.packs[p.id].anchor)
  const others = enabled.filter((p) => !profile.packs[p.id].anchor)

  const slots = []

  for (const pack of anchors) {
    const groups = pack.groups
      .filter((g) => profile.packs[pack.id].groups[g.id])
      .sort((a, b) => groupDistance(pack.id, b.id, recent) - groupDistance(pack.id, a.id, recent))
    const take = Math.min(groups.length, kind === 'long' ? 3 : 2)
    for (let i = 0; i < take; i++) {
      slots.push({ pack: pack.id, group: groups[i].id })
    }
  }

  // Then rounds of everything enabled, shuffled, until we have plenty of slots.
  const pool = enabled.length ? enabled : []
  for (let round = 0; round < 4 && pool.length; round++) {
    for (const pack of shuffled(pool)) slots.push({ pack: pack.id, group: null })
  }

  return slots
}

/**
 * Choose the exercises for one break.
 */
function chooseExercises (kind, totalSeconds, profile, recent) {
  const budget = Math.max(30, totalSeconds - TAIL_BUFFER_SECONDS)
  const candidates = EXERCISES.filter((ex) => isAvailable(ex, profile, kind))
  if (candidates.length === 0) return []

  const cooling = new Set(recent.slice(-COOLDOWN))
  const chosen = []
  const usedIds = new Set()
  let spent = 0

  // A long break ends with a closer (a walk, or a ride) if there is room.
  let closer = null
  if (kind === 'long') {
    const closers = candidates.filter((ex) => ex.closer)
    const affordable = closers.filter((ex) => costOf(ex) < budget * 0.6)
    if (affordable.length) {
      closer = weightedPick(affordable, recent)
      spent += costOf(closer)
      usedIds.add(closer.id)
    }
  }

  /**
   * `relax` allows falling back to exercises still on cooldown. Pack-targeted
   * slots never relax — if a pack has only one desk-friendly exercise and you
   * did it last break, it is better to give the slot to another pack than to
   * repeat. The final top-up pass relaxes so a break is never left empty.
   */
  const take = (filter, relax = false) => {
    const eligible = candidates.filter(
      (ex) => !usedIds.has(ex.id) && !ex.closer && filter(ex) && spent + costOf(ex) <= budget
    )
    if (!eligible.length) return false
    const fresh = eligible.filter((ex) => !cooling.has(ex.id))
    const pool = fresh.length ? fresh : (relax ? eligible : [])
    const pick = weightedPick(pool, recent)
    if (!pick) return false
    chosen.push(pick)
    usedIds.add(pick.id)
    spent += costOf(pick)
    return true
  }

  for (const slot of buildSlots(profile, kind, recent)) {
    if (slot.group) {
      // Prefer the requested group, but fall back to anything in that pack.
      if (!take((ex) => ex.pack === slot.pack && ex.groups.includes(slot.group))) {
        take((ex) => ex.pack === slot.pack)
      }
    } else {
      take((ex) => ex.pack === slot.pack)
    }
  }

  // Top up with anything else that still fits, cooldown relaxed as a last resort.
  let guard = 0
  while (take(() => true, true) && guard++ < 12) { /* keep filling */ }

  // A break with nothing in it is worse than a slightly overrunning one.
  if (chosen.length === 0 && !closer) {
    const fallback = candidates
      .filter((ex) => !ex.closer)
      .sort((a, b) => costOf(a) - costOf(b))[0]
    if (fallback) chosen.push(fallback)
  }

  if (closer) chosen.push(closer)
  return chosen
}

/**
 * Expand chosen exercises into a flat, timed segment list that the break
 * window renders one at a time.
 */
function buildSegments (exercises) {
  const segments = []
  exercises.forEach((ex, i) => {
    const previous = exercises[i - 1]
    segments.push({
      type: 'transition',
      seconds: TRANSITION_SECONDS + (previous ? REST_AFTER[previous.intensity] : 0),
      exerciseId: ex.id,
      exerciseIndex: i,
      exerciseCount: exercises.length
    })
    const sides = ex.perSide ? ['left', 'right'] : [null]
    sides.forEach((side, s) => {
      if (s > 0) {
        segments.push({
          type: 'switch',
          seconds: SIDE_SWITCH_SECONDS,
          exerciseId: ex.id,
          side,
          exerciseIndex: i,
          exerciseCount: exercises.length
        })
      }
      segments.push({
        type: 'exercise',
        seconds: ex.seconds,
        exerciseId: ex.id,
        side,
        exerciseIndex: i,
        exerciseCount: exercises.length
      })
    })
  })
  return segments
}

/**
 * @returns {{ exercises: object[], segments: object[] }}
 */
function buildBreakPlan (kind, totalSeconds, profile, recent) {
  const exercises = chooseExercises(kind, totalSeconds, profile, recent)
  return {
    exercises: exercises.map((ex) => ({ ...ex })),
    segments: buildSegments(exercises)
  }
}

/** Everything schedulable under a profile — used by the Exercises tab. */
function availabilityFor (profile) {
  const out = new Map()
  for (const ex of EXERCISES) {
    out.set(ex.id, {
      short: isAvailable(ex, profile, 'short'),
      long: isAvailable(ex, profile, 'long')
    })
  }
  return out
}

module.exports = { buildBreakPlan, availabilityFor, isAvailable, BY_ID }
