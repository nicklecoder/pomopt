'use strict'

/**
 * Exercise diagrams.
 *
 * Wording is imprecise for movement, so every exercise gets a figure. Rather
 * than 24 hand-drawn images, there is one parametric stick figure driven by
 * joint angles: each exercise declares a start pose and an end pose, and the
 * renderer interpolates between them on a loop. A handful of exercises where a
 * skeleton is the wrong view (feet seen from above, a foot in profile, lying on
 * the floor) supply their own draw function instead.
 *
 * Angle conventions, all in degrees:
 *   thigh / shin / upper arm / forearm — measured from straight down,
 *                                        positive swings forward (+x)
 *   torso                             — measured from straight up,
 *                                        positive leans forward
 *   foot                              — measured from horizontal,
 *                                        positive lifts the toes
 *
 * A knee is hyperextended when `shin` is less than `thigh`: the shin has swept
 * behind the thigh line, which is exactly the shape we need to be able to draw.
 */

const NS = 'http://www.w3.org/2000/svg'

const VIEW = { w: 300, h: 250 }
const GROUND = 214
const CENTER = 150

const SEG = {
  torso: 56,
  neck: 10,
  headR: 12,
  thigh: 47,
  shin: 47,
  foot: 21,
  heel: 9,
  upperArm: 25,
  foreArm: 23
}

const D2R = Math.PI / 180
const sin = (deg) => Math.sin(deg * D2R)
const cos = (deg) => Math.cos(deg * D2R)

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

/** Walk out from the hip and return every joint position. */
function skeleton (p) {
  const hip = { x: p.hipX ?? CENTER, y: p.hipY ?? 100 }

  const shoulder = {
    x: hip.x + SEG.torso * sin(p.torso),
    y: hip.y - SEG.torso * cos(p.torso)
  }
  const headAngle = p.torso + (p.headTilt || 0)
  const head = {
    x: shoulder.x + (SEG.neck + SEG.headR) * sin(headAngle),
    y: shoulder.y - (SEG.neck + SEG.headR) * cos(headAngle)
  }

  const leg = (l) => {
    const thighLen = SEG.thigh * (l.thighScale || 1)
    const shinLen = SEG.shin * (l.shinScale || 1)
    const knee = {
      x: hip.x + thighLen * sin(l.thigh),
      y: hip.y + thighLen * cos(l.thigh)
    }
    const ankle = {
      x: knee.x + shinLen * sin(l.shin),
      y: knee.y + shinLen * cos(l.shin)
    }
    const toe = {
      x: ankle.x + SEG.foot * cos(l.foot),
      y: ankle.y - SEG.foot * sin(l.foot)
    }
    const heel = {
      x: ankle.x - SEG.heel * cos(l.foot),
      y: ankle.y + SEG.heel * sin(l.foot)
    }
    return { knee, ankle, toe, heel }
  }

  const arm = (a) => {
    const elbow = {
      x: shoulder.x + SEG.upperArm * sin(a.upper),
      y: shoulder.y + SEG.upperArm * cos(a.upper)
    }
    const hand = {
      x: elbow.x + SEG.foreArm * sin(a.fore),
      y: elbow.y + SEG.foreArm * cos(a.fore)
    }
    return { elbow, hand }
  }

  const near = leg(p.near)
  const far = leg(p.far || p.near)
  const armNear = arm(p.arm || { upper: 6, fore: 8 })
  const armFar = arm(p.farArm || p.arm || { upper: 6, fore: 8 })

  const j = {
    hip, shoulder, head,
    knee: near.knee, ankle: near.ankle, toe: near.toe, heel: near.heel,
    farKnee: far.knee, farAnkle: far.ankle, farToe: far.toe, farHeel: far.heel,
    elbow: armNear.elbow, hand: armNear.hand,
    farElbow: armFar.elbow, farHand: armFar.hand
  }

  // Drop the figure so its lowest ground-contact point rests on the floor.
  if (p.ground !== false) {
    const contacts = (p.contacts || ['toe', 'heel', 'farToe', 'farHeel']).map((k) => j[k].y)
    const dy = GROUND - Math.max(...contacts)
    for (const key of Object.keys(j)) j[key] = { x: j[key].x + (p.dx || 0), y: j[key].y + dy }
  } else if (p.dx || p.dy) {
    for (const key of Object.keys(j)) j[key] = { x: j[key].x + (p.dx || 0), y: j[key].y + (p.dy || 0) }
  }

  return j
}

/** Standard element list for a side-view figure. */
function skeletonElements (j, opts = {}) {
  const far = { cls: 'fig-far' }
  const near = { cls: 'fig-limb' }
  const els = [
    // far side first so the near leg/arm reads on top
    { t: 'line', a: j.hip, b: j.farKnee, ...far },
    { t: 'line', a: j.farKnee, b: j.farAnkle, ...far },
    { t: 'line', a: j.farHeel, b: j.farToe, ...far },
    { t: 'line', a: j.shoulder, b: j.farElbow, ...far },
    { t: 'line', a: j.farElbow, b: j.farHand, ...far },

    { t: 'line', a: j.hip, b: j.shoulder, ...near },
    { t: 'line', a: j.shoulder, b: j.elbow, ...near },
    { t: 'line', a: j.elbow, b: j.hand, ...near },
    { t: 'line', a: j.hip, b: j.knee, ...near },
    { t: 'line', a: j.knee, b: j.ankle, ...near },
    { t: 'line', a: j.heel, b: j.toe, ...near },
    { t: 'circle', c: j.head, r: SEG.headR, cls: 'fig-head' }
  ]
  if (opts.markKnee !== false) {
    els.push({ t: 'circle', c: j.knee, r: 6, cls: 'fig-focus' })
  }
  return els
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

const floorLine = () => ({
  t: 'line', a: { x: 8, y: GROUND }, b: { x: VIEW.w - 8, y: GROUND }, cls: 'fig-ground'
})

const wallAt = (x) => ({
  t: 'line', a: { x, y: 18 }, b: { x, y: GROUND }, cls: 'fig-prop'
})

/** A step whose edge is at `edgeX`, with the tread running off to the left. */
const stepAt = (edgeX, h) => ({
  t: 'poly',
  points: [{ x: 8, y: GROUND - h }, { x: edgeX, y: GROUND - h }, { x: edgeX, y: GROUND }],
  cls: 'fig-prop'
})

const chairAt = (seatX, seatY) => ({
  t: 'poly',
  points: [
    { x: seatX + 60, y: seatY - 62 },
    { x: seatX + 60, y: seatY },
    { x: seatX - 26, y: seatY },
    { x: seatX - 26, y: GROUND }
  ],
  cls: 'fig-prop'
})

// ---------------------------------------------------------------------------
// Pose library
// ---------------------------------------------------------------------------

// Arms hang slightly forward so they read as arms rather than merging into the torso.
const STAND_ARM = { upper: 13, fore: 17 }
const DESK_ARM = { upper: 52, fore: 62 }

const WALL_X = 262

/**
 * Standing base pose; `bend` is how far the knees are unlocked.
 *
 * A knee is *flexed* when it sits forward of the hip-to-ankle line, so a
 * positive thigh angle paired with a negative shin angle is a soft knee.
 * Reversing the signs bows the knee backwards, which is the hyperextended
 * shape we draw for contrast.
 */
const stand = (bend, extra = {}) => ({
  torso: 2,
  near: { thigh: bend * 0.45, shin: -bend * 0.55, foot: 0 },
  far: { thigh: bend * 0.45, shin: -bend * 0.55, foot: 0 },
  arm: STAND_ARM,
  ...extra
})

const POSES = {
  // ---------------------------------------------------- hyperextension work
  'soft-knee-stance': {
    label: ['Locked — knee bows backwards', 'Soft knee — hold this'],
    // Dashed plumb line from hip to ankle makes the backward bow obvious.
    // Deliberately exaggerated — a true 5° difference is invisible at this size.
    a: { torso: 3, near: { thigh: -17, shin: 23, foot: 0 }, far: { thigh: -17, shin: 23, foot: 0 }, arm: STAND_ARM },
    b: { torso: 3, near: { thigh: 17, shin: -23, foot: 0 }, far: { thigh: 17, shin: -23, foot: 0 }, arm: STAND_ARM },
    extra: (j) => [
      floorLine(),
      { t: 'line', a: { x: j.hip.x, y: j.hip.y }, b: { x: j.hip.x, y: j.ankle.y }, cls: 'fig-guide' }
    ]
  },

  'quad-set': {
    label: ['Relax', 'Press knee down into the towel'],
    seated: true,
    a: {
      ground: false, hipX: 96, hipY: 150, torso: -8,
      near: { thigh: 88, shin: 84, foot: 34 },
      far: { thigh: 88, shin: 84, foot: 34 },
      arm: { upper: 62, fore: 78 }
    },
    b: {
      ground: false, hipX: 96, hipY: 150, torso: -8,
      near: { thigh: 90, shin: 92, foot: 44 },
      far: { thigh: 90, shin: 92, foot: 44 },
      arm: { upper: 62, fore: 78 }
    },
    extra: (j) => [
      floorLine(),
      { t: 'circle', c: { x: j.knee.x, y: j.knee.y + 11 }, r: 9, cls: 'fig-accent-fill' },
      { t: 'text', at: { x: j.knee.x, y: j.knee.y + 40 }, text: 'towel', cls: 'fig-label' }
    ]
  },

  'tke-band': {
    label: ['Knee bent', 'Straighten — stop short of locked'],
    a: { torso: 3, near: { thigh: 22, shin: -30, foot: 0 }, far: { thigh: 12, shin: -18, foot: 0 }, arm: STAND_ARM, dx: -26 },
    b: { torso: 3, near: { thigh: 6, shin: -9, foot: 0 }, far: { thigh: 12, shin: -18, foot: 0 }, arm: STAND_ARM, dx: -26 },
    extra: (j) => [
      floorLine(),
      { t: 'line', a: { x: VIEW.w - 14, y: 30 }, b: { x: VIEW.w - 14, y: GROUND }, cls: 'fig-prop' },
      { t: 'path', d: `M ${(j.knee.x + 5).toFixed(1)} ${j.knee.y.toFixed(1)} Q ${((j.knee.x + VIEW.w - 14) / 2).toFixed(1)} ${(j.knee.y - 7).toFixed(1)} ${VIEW.w - 14} ${j.knee.y.toFixed(1)}`, cls: 'fig-band' },
      { t: 'text', at: { x: VIEW.w - 44, y: j.knee.y - 16 }, text: 'band', cls: 'fig-label' }
    ]
  },

  'standing-ham-curl': {
    label: ['Start', 'Curl the heel toward your backside'],
    a: { torso: 3, near: { thigh: 2, shin: -4, foot: 0 }, far: { thigh: 2, shin: -4, foot: 0 }, arm: DESK_ARM, contacts: ['farToe', 'farHeel'] },
    b: { torso: 3, near: { thigh: 2, shin: -148, foot: -60 }, far: { thigh: 2, shin: -4, foot: 0 }, arm: DESK_ARM, contacts: ['farToe', 'farHeel'] },
    extra: () => [floorLine(), { t: 'line', a: { x: 152, y: 92 }, b: { x: VIEW.w - 8, y: 92 }, cls: 'fig-prop' }]
  },

  'single-leg-balance': {
    label: ['Stand on one leg, knee soft', 'Hold — let the foot and hip wobble'],
    a: { torso: 3, near: { thigh: 8, shin: -12, foot: 0 }, far: { thigh: 58, shin: 16, foot: 6 }, arm: { upper: 44, fore: 22 }, contacts: ['toe', 'heel'] },
    b: { torso: 5, near: { thigh: 10, shin: -14, foot: 0 }, far: { thigh: 64, shin: 20, foot: 6 }, arm: { upper: 52, fore: 30 }, contacts: ['toe', 'heel'] },
    focusJoint: 'knee',
    props: [floorLine()]
  },

  'shallow-wall-sit': {
    label: ['Back flat on the wall', 'Slide down 30–45°'],
    // Wall behind (on the left) so the feet can travel forward and the shins
    // stay vertical, which is what a wall sit actually looks like.
    a: { torso: 0, near: { thigh: 4, shin: -6, foot: 0 }, far: { thigh: 4, shin: -6, foot: 0 }, arm: STAND_ARM, ground: false, hipX: 58, hipY: 120 },
    b: { torso: 0, near: { thigh: 50, shin: 2, foot: 0 }, far: { thigh: 50, shin: 2, foot: 0 }, arm: { upper: 62, fore: 64 }, ground: false, hipX: 58, hipY: 136 },
    extra: () => [floorLine(), wallAt(46)]
  },

  'hip-hinge': {
    label: ['Stand, knees soft', 'Hips back, chest down'],
    a: stand(12),
    b: { torso: 62, near: { thigh: -24, shin: 10, foot: 0 }, far: { thigh: -24, shin: 10, foot: 0 }, arm: { upper: -8, fore: -6 }, dx: 14 },
    props: [floorLine()]
  },

  'step-down': {
    // Standing leg is the near (white) one; the free leg lowers to tap the floor.
    label: ['Stand tall on the step', 'Lower slowly — free heel taps the floor'],
    a: { torso: 4, near: { thigh: -4, shin: 6, foot: 0 }, far: { thigh: 20, shin: 26, foot: 4 }, arm: { upper: 44, fore: 38 }, ground: false, hipX: 140, hipY: 98 },
    b: { torso: 10, near: { thigh: 45, shin: -45, foot: 0 }, far: { thigh: 22, shin: 22, foot: 0 }, arm: { upper: 44, fore: 38 }, ground: false, hipX: 140, hipY: 126 },
    focusJoint: 'knee',
    extra: () => [floorLine(), stepAt(162, 22)]
  },

  'glute-bridge': {
    label: ['Hips down', 'Drive through the heels'],
    custom: true,
    a: { lift: 0 },
    b: { lift: 34 },
    draw: (p) => {
      const shoulder = { x: 78, y: GROUND - 10 }
      const hip = { x: 152, y: GROUND - 10 - p.lift }
      const knee = { x: 196, y: GROUND - 44 - p.lift * 0.25 }
      const heel = { x: 214, y: GROUND }
      const head = { x: 58, y: GROUND - 16 }
      return [
        floorLine(),
        { t: 'line', a: shoulder, b: hip, cls: 'fig-limb' },
        { t: 'line', a: hip, b: knee, cls: 'fig-limb' },
        { t: 'line', a: knee, b: heel, cls: 'fig-limb' },
        { t: 'line', a: heel, b: { x: heel.x + 20, y: GROUND }, cls: 'fig-limb' },
        { t: 'line', a: shoulder, b: { x: shoulder.x + 40, y: GROUND - 4 }, cls: 'fig-far' },
        { t: 'circle', c: head, r: SEG.headR, cls: 'fig-head' },
        { t: 'circle', c: hip, r: 6, cls: 'fig-focus' },
        { t: 'text', at: { x: heel.x, y: GROUND + 20 }, text: 'push through the heels', cls: 'fig-label' }
      ]
    }
  },

  // ------------------------------------------------------------ out-toeing
  'toes-forward-drill': {
    label: ['Your habit — toes out', 'Target — outer edges parallel'],
    custom: true,
    a: { angle: 26 },
    b: { angle: 1 },
    draw: (p) => [
      { t: 'text', at: { x: 150, y: 26 }, text: 'seen from above — seams run away from you', cls: 'fig-label' },
      // Reference seams run forward (up the page), so straight feet lie along them.
      { t: 'line', a: { x: 104, y: 40 }, b: { x: 104, y: 206 }, cls: 'fig-ground' },
      { t: 'line', a: { x: 196, y: 40 }, b: { x: 196, y: 206 }, cls: 'fig-ground' },
      ...foot({ x: 104, y: 176 }, -p.angle, 'left', 1.15),
      ...foot({ x: 196, y: 176 }, p.angle, 'right', 1.15),
      { t: 'text', at: { x: 150, y: 232 }, text: `${Math.round(p.angle)}° out`, cls: 'fig-label-strong' }
    ]
  },

  // For the wall exercises the hands must visibly reach the wall, so the
  // figure is pushed right until the reaching hand lands on WALL_X.
  'gastroc-stretch': {
    label: ['Back leg straight, heel pressed down', 'Lean the hips toward the wall'],
    a: { torso: 14, near: { thigh: -26, shin: -20, foot: 0 }, far: { thigh: 18, shin: 24, foot: 0 }, arm: { upper: 76, fore: 84 }, dx: 30 },
    b: { torso: 20, near: { thigh: -34, shin: -28, foot: 0 }, far: { thigh: 24, shin: 32, foot: 0 }, arm: { upper: 82, fore: 88 }, dx: 30 },
    focusJoint: 'heel',
    extra: () => [floorLine(), wallAt(WALL_X)]
  },

  'soleus-stretch': {
    label: ['Same stance, stand a little closer', 'Bend the back knee — heel stays down'],
    a: { torso: 12, near: { thigh: -22, shin: -14, foot: 0 }, far: { thigh: 16, shin: 22, foot: 0 }, arm: { upper: 76, fore: 84 }, dx: 38 },
    b: { torso: 14, near: { thigh: -26, shin: 8, foot: 0 }, far: { thigh: 20, shin: 28, foot: 0 }, arm: { upper: 80, fore: 86 }, dx: 38 },
    focusJoint: 'heel',
    extra: () => [floorLine(), wallAt(WALL_X)]
  },

  'knee-to-wall': {
    label: ['Foot a hand-width from the wall', 'Knee to the wall — heel stays down'],
    a: { torso: 8, near: { thigh: 10, shin: -12, foot: 0 }, far: { thigh: -30, shin: -16, foot: 0 }, arm: { upper: 74, fore: 82 }, dx: 24 },
    b: { torso: 12, near: { thigh: 46, shin: -30, foot: 0 }, far: { thigh: -34, shin: -20, foot: 0 }, arm: { upper: 78, fore: 84 }, dx: 24 },
    extra: () => [floorLine(), wallAt(WALL_X)]
  },

  'seated-hip-ir': {
    label: ['Knees stay put', 'Swing the foot out — hip rolls in'],
    custom: true,
    a: { swing: 0 },
    b: { swing: 34 },
    draw: (p) => {
      const hip = { x: 150, y: 62 }
      const knee = { x: 150, y: 132 }
      const ankle = {
        x: knee.x + 62 * sin(p.swing),
        y: knee.y + 62 * cos(p.swing)
      }
      return [
        { t: 'text', at: { x: 150, y: 26 }, text: 'seen from above', cls: 'fig-label' },
        { t: 'line', a: { x: 108, y: 62 }, b: { x: 192, y: 62 }, cls: 'fig-prop' },
        { t: 'line', a: hip, b: knee, cls: 'fig-limb' },
        { t: 'line', a: knee, b: ankle, cls: 'fig-limb' },
        { t: 'circle', c: knee, r: 6, cls: 'fig-focus' },
        { t: 'line', a: knee, b: { x: knee.x, y: knee.y + 62 }, cls: 'fig-guide' },
        ...foot(ankle, p.swing, 'right', 0.85),
        { t: 'text', at: { x: 150, y: 232 }, text: 'knee is the pivot — do not let it move', cls: 'fig-label' }
      ]
    }
  },

  'standing-hip-ir': {
    label: ['Square', 'Rotate the pelvis away — foot stays put'],
    custom: true,
    a: { rot: 0 },
    b: { rot: 26 },
    draw: (p) => {
      const cx = 150
      const pelvisY = 74
      const half = 40
      const l = { x: cx - half * cos(p.rot), y: pelvisY - half * sin(p.rot) }
      const r = { x: cx + half * cos(p.rot), y: pelvisY + half * sin(p.rot) }
      return [
        { t: 'text', at: { x: 150, y: 30 }, text: 'seen from above', cls: 'fig-label' },
        { t: 'line', a: { x: cx - half, y: pelvisY }, b: { x: cx + half, y: pelvisY }, cls: 'fig-guide' },
        { t: 'line', a: l, b: r, cls: 'fig-limb' },
        { t: 'circle', c: l, r: 5, cls: 'fig-far-fill' },
        { t: 'circle', c: r, r: 6, cls: 'fig-focus' },
        { t: 'text', at: { x: 62, y: pelvisY + 24 }, text: 'pelvis', cls: 'fig-label' },
        { t: 'line', a: { x: r.x, y: r.y }, b: { x: 190, y: 150 }, cls: 'fig-far' },
        ...foot({ x: 190, y: 168 }, 0, 'right'),
        { t: 'text', at: { x: 150, y: 236 }, text: 'foot stays flat and straight', cls: 'fig-label' }
      ]
    }
  },

  'figure-four': {
    label: ['Ankle across the knee', 'Hinge forward from the hips'],
    a: {
      ground: false, hipX: 128, hipY: 128, torso: 4,
      near: { thigh: 62, shin: 130, foot: 20, thighScale: 0.9 },
      far: { thigh: 92, shin: 92, foot: 10 },
      arm: { upper: 30, fore: 40 }
    },
    b: {
      ground: false, hipX: 128, hipY: 128, torso: 40,
      near: { thigh: 62, shin: 130, foot: 20, thighScale: 0.9 },
      far: { thigh: 92, shin: 92, foot: 10 },
      arm: { upper: 20, fore: 34 }
    },
    focusJoint: 'farKnee',
    extra: () => [floorLine(), chairAt(128, 150)]
  },

  'short-foot': {
    label: ['Arch flat', 'Draw the ball toward the heel'],
    custom: true,
    a: { dome: 0 },
    b: { dome: 15 },
    draw: (p) => {
      const heel = { x: 74, y: GROUND }
      const ball = { x: 206 - p.dome * 0.9, y: GROUND }
      const arch = { x: (heel.x + ball.x) / 2, y: GROUND - 14 - p.dome }
      const toe = { x: ball.x + 34, y: GROUND }
      return [
        floorLine(),
        { t: 'path', d: `M ${heel.x} ${heel.y} Q ${arch.x} ${arch.y} ${ball.x} ${ball.y}`, cls: 'fig-limb' },
        { t: 'line', a: ball, b: toe, cls: 'fig-limb' },
        { t: 'line', a: { x: heel.x, y: GROUND - 26 }, b: heel, cls: 'fig-limb' },
        { t: 'circle', c: { x: arch.x, y: arch.y }, r: 5, cls: 'fig-focus' },
        { t: 'text', at: { x: arch.x, y: arch.y - 16 }, text: 'arch lifts', cls: 'fig-label' },
        { t: 'text', at: { x: toe.x - 4, y: GROUND + 22 }, text: 'toes stay flat', cls: 'fig-label' }
      ]
    }
  },

  'adductor-squeeze': {
    label: ['Knees apart', 'Squeeze inward'],
    custom: true,
    a: { gap: 30 },
    b: { gap: 14 },
    draw: (p) => {
      const hipY = 74
      const kneeY = 150
      const hipHalf = 32
      const els = [
        { t: 'text', at: { x: 150, y: 30 }, text: 'seen from the front', cls: 'fig-label' },
        { t: 'line', a: { x: 150 - hipHalf, y: hipY }, b: { x: 150 + hipHalf, y: hipY }, cls: 'fig-limb' }
      ]
      for (const s of [-1, 1]) {
        const hip = { x: 150 + s * hipHalf, y: hipY }
        const knee = { x: 150 + s * p.gap, y: kneeY }
        const foot = { x: 150 + s * (p.gap + 4), y: GROUND }
        els.push(
          { t: 'line', a: hip, b: knee, cls: 'fig-limb' },
          { t: 'line', a: knee, b: foot, cls: 'fig-limb' },
          { t: 'circle', c: knee, r: 6, cls: 'fig-focus' }
        )
      }
      els.push(
        { t: 'rect', x: 150 - p.gap + 2, y: kneeY - 11, w: Math.max(4, p.gap * 2 - 4), h: 22, rx: 8, cls: 'fig-accent-fill' },
        { t: 'text', at: { x: 150, y: 238 }, text: 'towel / fist / bottle between the knees', cls: 'fig-label' }
      )
      return els
    }
  },

  'tib-raises': {
    label: ['Feet flat, back on the wall', 'Lift the toes — heels stay down'],
    a: { torso: 0, near: { thigh: 5, shin: -8, foot: 0 }, far: { thigh: 5, shin: -8, foot: 0 }, arm: STAND_ARM, contacts: ['heel', 'farHeel'], dx: 44 },
    b: { torso: 0, near: { thigh: 5, shin: -8, foot: 34 }, far: { thigh: 5, shin: -8, foot: 34 }, arm: STAND_ARM, contacts: ['heel', 'farHeel'], dx: 44 },
    focusJoint: 'toe',
    extra: () => [floorLine(), wallAt(WALL_X)]
  },

  'ninety-ninety': {
    label: ['One side', 'Switch through the middle'],
    custom: true,
    a: { s: 1 },
    b: { s: -1 },
    draw: (p) => {
      // Top-down, sitting at `hip` facing up the page. The front shin sweeps
      // from one side to the other, passing through "pointing straight ahead"
      // so no segment ever collapses to zero length mid-animation.
      const hip = { x: 150, y: 118 }
      const kneeF = { x: 150, y: 68 }
      const ankleF = { x: 150 + 48 * sin(90 * p.s), y: 68 - 48 * cos(90 * p.s) }
      const kneeB = { x: 150 + 52 * sin(90 * p.s), y: 118 + 52 * cos(90 * p.s) }
      const ankleB = { x: kneeB.x, y: kneeB.y + 46 }
      return [
        { t: 'text', at: { x: 150, y: 28 }, text: 'seen from above, facing up the page', cls: 'fig-label' },
        { t: 'line', a: hip, b: kneeB, cls: 'fig-far' },
        { t: 'line', a: kneeB, b: ankleB, cls: 'fig-far' },
        { t: 'line', a: hip, b: kneeF, cls: 'fig-limb' },
        { t: 'line', a: kneeF, b: ankleF, cls: 'fig-limb' },
        { t: 'circle', c: hip, r: 12, cls: 'fig-head' },
        { t: 'circle', c: kneeF, r: 6, cls: 'fig-focus' },
        { t: 'text', at: { x: 150, y: 238 }, text: 'front leg white, back leg grey — both bent 90°', cls: 'fig-label' }
      ]
    }
  },

  // ---------------------------------------------------------- circulation
  'calf-pumps': {
    label: ['Heels down', 'Rise onto the balls of the feet'],
    a: { torso: 2, near: { thigh: -6, shin: 10, foot: 0 }, far: { thigh: -6, shin: 10, foot: 0 }, arm: DESK_ARM },
    b: { torso: 2, near: { thigh: -6, shin: 10, foot: -34 }, far: { thigh: -6, shin: 10, foot: -34 }, arm: DESK_ARM },
    focusJoint: 'heel',
    extra: () => [floorLine(), { t: 'line', a: { x: 150, y: 92 }, b: { x: VIEW.w - 8, y: 92 }, cls: 'fig-prop' }]
  },

  'hip-flexor-stretch': {
    label: ['Half kneeling', 'Tuck the tail, squeeze the glute, shift forward'],
    a: {
      torso: 6,
      near: { thigh: -70, shin: -170, foot: -34 },
      far: { thigh: 44, shin: -6, foot: 0 },
      arm: { upper: 10, fore: 14 }, dx: 6
    },
    b: {
      torso: -4,
      near: { thigh: -84, shin: -178, foot: -34 },
      far: { thigh: 34, shin: -14, foot: 0 },
      arm: { upper: 10, fore: 14 }, dx: 6
    },
    focusJoint: 'hip',
    props: [floorLine()]
  },

  marching: {
    label: ['Stand tall', 'Knee to hip height, land toes forward'],
    a: { torso: 2, near: { thigh: -4, shin: 8, foot: 0 }, far: { thigh: -4, shin: 8, foot: 0 }, arm: { upper: 10, fore: 16 }, contacts: ['farToe', 'farHeel'] },
    b: { torso: 2, near: { thigh: 62, shin: 8, foot: 14 }, far: { thigh: -6, shin: 12, foot: 0 }, arm: { upper: -22, fore: -14 }, contacts: ['farToe', 'farHeel'] },
    props: [floorLine()]
  },

  'walk-it-out': {
    label: ['Easy pace', 'Let the knee bend naturally'],
    a: { torso: 4, near: { thigh: 26, shin: 30, foot: 12 }, far: { thigh: -24, shin: -12, foot: -8 }, arm: { upper: -18, fore: -10 }, farArm: { upper: 22, fore: 30 }, contacts: ['farToe', 'heel'] },
    b: { torso: 4, near: { thigh: -24, shin: -10, foot: -6 }, far: { thigh: 26, shin: 30, foot: 12 }, arm: { upper: 22, fore: 30 }, farArm: { upper: -18, fore: -10 }, contacts: ['toe', 'farHeel'] },
    props: [floorLine()]
  }
}

/** Connect a run of points with limb lines. */
const chain = (pts, cls = 'fig-limb') =>
  pts.slice(1).map((p, i) => ({ t: 'line', a: pts[i], b: p, cls }))

const P = (x, y) => ({ x, y })

/** A dumbbell in the hand, drawn along or across the forearm. */
const dumbbell = (at, vertical = false) =>
  vertical
    ? { t: 'rect', x: at.x - 5, y: at.y - 14, w: 10, h: 28, rx: 4, cls: 'fig-accent-fill' }
    : { t: 'rect', x: at.x - 15, y: at.y - 5, w: 30, h: 10, rx: 4, cls: 'fig-accent-fill' }

/** Flat or inclined weight bench. `rise` lifts the right-hand end. */
const benchProp = (x0, x1, topY, rise = 0) => [
  { t: 'line', a: P(x0, topY), b: P(x1, topY - rise), cls: 'fig-prop' },
  { t: 'line', a: P(x0 + 12, topY), b: P(x0 + 12, GROUND), cls: 'fig-prop' },
  { t: 'line', a: P(x1 - 12, topY - rise + rise * 0.1), b: P(x1 - 12, GROUND), cls: 'fig-prop' }
]

/** A step whose edge is at `edgeX`, tread running off to the RIGHT. */
const stepRight = (edgeX, h) => ({
  t: 'poly',
  points: [P(VIEW.w - 8, GROUND - h), P(edgeX, GROUND - h), P(edgeX, GROUND)],
  cls: 'fig-prop'
})

/** A short flight of stairs climbing to the right. */
const stairsProp = (x0, treads, rise, run) => {
  const pts = [P(x0, GROUND)]
  for (let i = 0; i < treads; i++) {
    const y = GROUND - rise * (i + 1)
    pts.push(P(x0 + run * i, y), P(x0 + run * (i + 1), y))
  }
  return { t: 'poly', points: pts, cls: 'fig-prop' }
}

/** Stationary bike seen from the side. */
const bikeProp = (crankAngle) => {
  const rear = P(80, 182)
  const front = P(214, 182)
  const crank = P(152, 176)
  const pedal = P(crank.x + 17 * sin(crankAngle), crank.y + 17 * cos(crankAngle))
  return {
    seat: P(126, 122),
    bars: P(200, 108),
    crank,
    pedal,
    els: [
      { t: 'circle', c: rear, r: 26, cls: 'fig-prop' },
      { t: 'circle', c: front, r: 26, cls: 'fig-prop' },
      ...chain([rear, P(126, 126), P(200, 112), front], 'fig-prop'),
      ...chain([P(126, 126), crank, rear], 'fig-prop'),
      { t: 'line', a: P(112, 122), b: P(140, 122), cls: 'fig-prop' },
      { t: 'line', a: P(190, 106), b: P(212, 110), cls: 'fig-prop' },
      { t: 'circle', c: crank, r: 17, cls: 'fig-guide' }
    ]
  }
}

/**
 * Symmetric front-view figure. `armChain` and `legChain` are offsets from the
 * shoulder / hip joint, mirrored to both sides.
 */
function frontBody (cx, headY, shoulderY, hipY, armChain, legChain, opts = {}) {
  const sh = opts.halfShoulder === undefined ? 26 : opts.halfShoulder
  const hp = opts.halfHip === undefined ? 17 : opts.halfHip
  const els = [
    { t: 'line', a: P(cx - sh, shoulderY), b: P(cx + sh, shoulderY), cls: 'fig-limb' },
    { t: 'line', a: P(cx, shoulderY), b: P(cx, hipY), cls: 'fig-limb' },
    { t: 'line', a: P(cx - hp, hipY), b: P(cx + hp, hipY), cls: 'fig-limb' }
  ]
  for (const s of [-1, 1]) {
    if (armChain.length) {
      els.push(...chain([P(cx + s * sh, shoulderY), ...armChain.map(([dx, dy]) => P(cx + s * (sh + dx), shoulderY + dy))]))
    }
    if (legChain.length) {
      els.push(...chain([P(cx + s * hp, hipY), ...legChain.map(([dx, dy]) => P(cx + s * (hp + dx), hipY + dy))]))
    }
  }
  els.push({ t: 'circle', c: P(cx + (opts.headDx || 0), headY), r: SEG.headR, cls: 'fig-head' })
  return els
}

/** Interpolate two equal-length point lists — used for multi-stage flows. */
const lerpPts = (a, b, u) => a.map((p, i) => P(p.x + (b[i].x - p.x) * u, p.y + (b[i].y - p.y) * u))

/**
 * Pick a keyframe pair for a flow with more than two shapes and return the
 * interpolated points. `u` runs 0..1 across the whole sequence.
 */
function keyframe (frames, u) {
  const span = 1 / (frames.length - 1)
  const i = Math.min(frames.length - 2, Math.floor(u / span))
  return lerpPts(frames[i], frames[i + 1], (u - i * span) / span)
}

/**
 * Diagrams for the strength, core and yoga packs.
 *
 * Coverage is deliberately partial: these are the exercises where getting the
 * shape wrong causes injury (rounding under load, arching under load, locking a
 * knee) or where the words are genuinely ambiguous. Exercises without an entry
 * simply render without a figure — `createFigure` returns null and the break
 * screen hides the slot.
 */
const PACK_POSES = {
  // ------------------------------------------------------------- hinge work
  'db-rdl': {
    label: ['Stand, knees soft', 'Hips back — flat back, soft knee held'],
    a: { torso: 3, near: { thigh: 8, shin: -12, foot: 0 }, far: { thigh: 8, shin: -12, foot: 0 }, arm: { upper: 4, fore: 4 } },
    b: { torso: 66, near: { thigh: -20, shin: 8, foot: 0 }, far: { thigh: -20, shin: 8, foot: 0 }, arm: { upper: -4, fore: -2 }, dx: 16 },
    extra: (j) => [
      floorLine(),
      { t: 'line', a: j.shoulder, b: j.hip, cls: 'fig-guide' },
      { t: 'rect', x: j.hand.x - 15, y: j.hand.y - 5, w: 30, h: 10, rx: 4, cls: 'fig-accent-fill' }
    ]
  },

  'db-bent-row': {
    label: ['Hinged, back flat, dumbbells hanging', 'Row to the lower ribs'],
    a: { torso: 48, near: { thigh: -16, shin: 8, foot: 0 }, far: { thigh: -16, shin: 8, foot: 0 }, arm: { upper: -34, fore: -36 }, dx: 12 },
    b: { torso: 48, near: { thigh: -16, shin: 8, foot: 0 }, far: { thigh: -16, shin: 8, foot: 0 }, arm: { upper: -84, fore: 16 }, dx: 12 },
    extra: (j) => [
      floorLine(),
      { t: 'line', a: j.shoulder, b: j.hip, cls: 'fig-guide' },
      { t: 'rect', x: j.hand.x - 15, y: j.hand.y - 5, w: 30, h: 10, rx: 4, cls: 'fig-accent-fill' }
    ]
  },

  'kb-swing': {
    label: ['Hinge — weight back between the legs', 'Snap the hips through'],
    a: { torso: 54, near: { thigh: -18, shin: 10, foot: 0 }, far: { thigh: -18, shin: 10, foot: 0 }, arm: { upper: -28, fore: -30 }, dx: 14 },
    b: { torso: -2, near: { thigh: 6, shin: -10, foot: 0 }, far: { thigh: 6, shin: -10, foot: 0 }, arm: { upper: 76, fore: 86 }, dx: 14 },
    focusJoint: 'hip',
    extra: (j) => [
      floorLine(),
      { t: 'circle', c: j.hand, r: 9, cls: 'fig-accent-fill' },
      { t: 'text', at: { x: 150, y: 238 }, text: 'power from the hips, never the arms', cls: 'fig-label' }
    ]
  },

  'db-single-leg-rdl': {
    label: ['Stand on one soft knee', 'Hinge — free leg travels back'],
    a: { torso: 4, near: { thigh: 8, shin: -12, foot: 0 }, far: { thigh: -18, shin: -8, foot: 0 }, arm: { upper: 4, fore: 4 }, contacts: ['toe', 'heel'] },
    b: { torso: 74, near: { thigh: 10, shin: -14, foot: 0 }, far: { thigh: -74, shin: -6, foot: -10 }, arm: { upper: -6, fore: -4 }, contacts: ['toe', 'heel'], dx: 10 },
    focusJoint: 'knee',
    extra: (j) => [
      floorLine(),
      { t: 'line', a: j.shoulder, b: j.farAnkle, cls: 'fig-guide' }
    ]
  },

  // ------------------------------------------------------------ squat work
  'db-goblet-squat': {
    label: ['Weight at the chest, toes forward', 'Sit down between the hips'],
    a: { torso: 4, near: { thigh: 8, shin: -12, foot: 0 }, far: { thigh: 8, shin: -12, foot: 0 }, arm: { upper: 88, fore: -74 } },
    b: { torso: 18, near: { thigh: 52, shin: -44, foot: 0 }, far: { thigh: 52, shin: -44, foot: 0 }, arm: { upper: 88, fore: -74 } },
    extra: (j) => [
      floorLine(),
      { t: 'rect', x: j.hand.x - 9, y: j.hand.y - 13, w: 18, h: 26, rx: 5, cls: 'fig-accent-fill' },
      { t: 'line', a: { x: j.knee.x, y: j.knee.y }, b: { x: j.knee.x, y: GROUND }, cls: 'fig-guide' }
    ]
  },

  'bw-box-squat': {
    label: ['Stand in front of the chair', 'Hips back, touch, stand'],
    a: { torso: 4, near: { thigh: 8, shin: -12, foot: 0 }, far: { thigh: 8, shin: -12, foot: 0 }, arm: { upper: 34, fore: 46 }, ground: false, hipX: 122, hipY: 118 },
    b: { torso: 26, near: { thigh: 46, shin: -40, foot: 0 }, far: { thigh: 46, shin: -40, foot: 0 }, arm: { upper: 62, fore: 66 }, ground: false, hipX: 116, hipY: 150 },
    extra: () => [floorLine(), chairAt(104, 168)]
  },

  'chair-pose': {
    label: ['Tall, toes forward', 'Hips back and down, weight in the heels'],
    a: { torso: 3, near: { thigh: 8, shin: -12, foot: 0 }, far: { thigh: 8, shin: -12, foot: 0 }, arm: { upper: 8, fore: 10 } },
    b: { torso: 26, near: { thigh: 42, shin: -38, foot: 0 }, far: { thigh: 42, shin: -38, foot: 0 }, arm: { upper: 150, fore: 162 }, dx: 8 },
    extra: (j) => [
      floorLine(),
      { t: 'circle', c: j.heel, r: 6, cls: 'fig-focus' },
      { t: 'text', at: { x: 150, y: 238 }, text: 'weight stays in the heels', cls: 'fig-label' }
    ]
  },

  // ------------------------------------------------------------ lunge work
  'reverse-lunge': {
    label: ['Stand tall, toes forward', 'Step straight back and lower'],
    // Deep enough that the back knee genuinely approaches the floor: front
    // thigh near horizontal, front shin vertical, back shin swept back and up
    // onto a raised heel.
    a: { torso: 3, near: { thigh: 8, shin: -12, foot: 0 }, far: { thigh: 8, shin: -12, foot: 0 }, arm: { upper: 8, fore: 10 }, ground: false, hipX: 150, hipY: 122 },
    b: { torso: 10, near: { thigh: 86, shin: 2, foot: 0 }, far: { thigh: -20, shin: -100, foot: -35 }, arm: { upper: 12, fore: 16 }, ground: false, hipX: 146, hipY: 167 },
    focusJoint: 'knee',
    extra: (j) => [
      floorLine(),
      { t: 'line', a: { x: j.knee.x, y: j.knee.y }, b: { x: j.knee.x, y: GROUND }, cls: 'fig-guide' },
      { t: 'text', at: { x: 150, y: 238 }, text: 'front shin stays near vertical', cls: 'fig-label' }
    ]
  },

  'db-split-squat': {
    label: ['Long stride, back heel up', 'Lower straight down'],
    a: { torso: 4, near: { thigh: 24, shin: -22, foot: 0 }, far: { thigh: -30, shin: -22, foot: -30 }, arm: { upper: 4, fore: 4 }, contacts: ['toe', 'heel'] },
    b: { torso: 6, near: { thigh: 38, shin: -34, foot: 0 }, far: { thigh: -44, shin: -62, foot: -40 }, arm: { upper: 4, fore: 4 }, contacts: ['toe', 'heel'] },
    focusJoint: 'knee',
    extra: (j) => [
      floorLine(),
      { t: 'rect', x: j.hand.x - 14, y: j.hand.y - 5, w: 28, h: 10, rx: 4, cls: 'fig-accent-fill' }
    ]
  },

  // ------------------------------------------------------------ press work
  'db-shoulder-press': {
    label: ['Dumbbells at the shoulders', 'Press up — ribs down, no arching'],
    a: { torso: 2, near: { thigh: 7, shin: -11, foot: 0 }, far: { thigh: 7, shin: -11, foot: 0 }, arm: { upper: 152, fore: 34 } },
    b: { torso: 2, near: { thigh: 7, shin: -11, foot: 0 }, far: { thigh: 7, shin: -11, foot: 0 }, arm: { upper: 174, fore: 178 } },
    extra: (j) => [
      floorLine(),
      { t: 'rect', x: j.hand.x - 15, y: j.hand.y - 5, w: 30, h: 10, rx: 4, cls: 'fig-accent-fill' },
      { t: 'line', a: j.shoulder, b: j.hip, cls: 'fig-guide' }
    ]
  },

  // ------------------------------------------------------------------ core
  plank: {
    label: ['Hips sagging — this is the failure', 'One straight line — hold this'],
    custom: true,
    a: { sag: 20 },
    b: { sag: 0 },
    draw: (p) => {
      const shoulder = P(104, 176)
      const hip = P(168, 186 + p.sag)
      const ankle = P(230, 198)
      return [
        floorLine(),
        ...chain([P(72, GROUND), P(100, GROUND), shoulder]),
        ...chain([shoulder, hip, ankle, P(242, GROUND)]),
        { t: 'circle', c: P(86, 164), r: SEG.headR, cls: 'fig-head' },
        { t: 'line', a: shoulder, b: ankle, cls: 'fig-guide' },
        { t: 'circle', c: hip, r: 6, cls: 'fig-focus' },
        { t: 'text', at: P(168, 236), text: 'hip rides on the dashed line', cls: 'fig-label' }
      ]
    }
  },

  'dead-bug': {
    label: ['Knees over hips, arms up', 'Extend opposite arm and leg'],
    custom: true,
    a: { out: 0 },
    b: { out: 1 },
    // One arm and one leg only — drawing all four limbs from the side turns
    // into an unreadable tangle.
    draw: (p) => {
      const hip = P(174, 200)
      const shoulder = P(106, 200)
      const knee = P(174 + 20 * p.out, 146 + 26 * p.out)
      const ankle = P(knee.x + 36, knee.y + 8 + 30 * p.out)
      const elbow = P(102 - 12 * p.out, 152)
      const hand = P(elbow.x - 10 - 28 * p.out, elbow.y - 16 + 46 * p.out)
      return [
        floorLine(),
        ...chain([shoulder, hip]),
        ...chain([hip, knee, ankle]),
        ...chain([shoulder, elbow, hand]),
        { t: 'circle', c: P(86, 200), r: SEG.headR, cls: 'fig-head' },
        { t: 'line', a: P(112, GROUND - 3), b: P(200, GROUND - 3), cls: 'fig-guide' },
        { t: 'circle', c: P(150, 202), r: 6, cls: 'fig-focus' },
        { t: 'text', at: P(150, 238), text: 'lower back stays pressed to the floor', cls: 'fig-label' }
      ]
    }
  },

  'ab-rollout-knees': {
    label: ['Kneeling, braced, tail tucked', 'Roll out only as far as the back stays flat'],
    custom: true,
    a: { out: 0 },
    b: { out: 1 },
    draw: (p) => {
      const knee = P(196, GROUND)
      const hip = P(186 - 8 * p.out, 152 + 4 * p.out)
      const shoulder = P(150 - 34 * p.out, 138 + 26 * p.out)
      const hand = P(shoulder.x - 18 - 26 * p.out, 196 + 8 * p.out)
      return [
        floorLine(),
        ...chain([P(232, GROUND - 4), knee, hip, shoulder]),
        ...chain([shoulder, hand]),
        { t: 'circle', c: P(shoulder.x - 4, shoulder.y - 20), r: SEG.headR, cls: 'fig-head' },
        { t: 'circle', c: P(hand.x - 6, GROUND - 10), r: 10, cls: 'fig-accent-fill' },
        { t: 'line', a: shoulder, b: hip, cls: 'fig-guide' },
        { t: 'circle', c: P((shoulder.x + hip.x) / 2, (shoulder.y + hip.y) / 2), r: 5, cls: 'fig-focus' },
        { t: 'text', at: P(150, 238), text: 'stop before the lower back gives way', cls: 'fig-label' }
      ]
    }
  },

  // ------------------------------------------------------------------ yoga
  'downward-dog': {
    label: ['Knees BENT — long spine', 'Pedal the feet, spine still long'],
    custom: true,
    a: { bend: 1 },
    b: { bend: 0.55 },
    draw: (p) => {
      const hand = P(74, GROUND)
      const hip = P(178, 96)
      const knee = P(200 + 10 * (1 - p.bend), 150 - 8 * p.bend)
      const heel = P(216, GROUND - 20 * p.bend)
      return [
        floorLine(),
        ...chain([hand, P(96, 152), hip]),
        ...chain([hip, knee, heel]),
        ...chain([heel, P(238, GROUND)]),
        { t: 'circle', c: P(78, 168), r: SEG.headR, cls: 'fig-head' },
        { t: 'line', a: hand, b: hip, cls: 'fig-guide' },
        { t: 'circle', c: knee, r: 6, cls: 'fig-focus' },
        { t: 'text', at: P(150, 238), text: 'never push the knees back to straight', cls: 'fig-label' }
      ]
    }
  },

  'childs-pose': {
    label: ['Kneel, knees wide', 'Hips to heels, forehead down'],
    custom: true,
    a: { fold: 0 },
    b: { fold: 1 },
    draw: (p) => {
      const knee = P(198, GROUND)
      const hip = P(196 - 6 * p.fold, 150 + 50 * p.fold)
      const shoulder = P(150 - 20 * p.fold, 116 + 82 * p.fold)
      const hand = P(shoulder.x - 40 - 22 * p.fold, 150 + 58 * p.fold)
      return [
        floorLine(),
        ...chain([P(230, GROUND - 4), knee, hip, shoulder, hand]),
        { t: 'circle', c: P(shoulder.x - 16, shoulder.y - 14 + 12 * p.fold), r: SEG.headR, cls: 'fig-head' },
        { t: 'text', at: P(150, 238), text: 'cushion under the hips if the knees complain', cls: 'fig-label' }
      ]
    }
  },

  'tree-pose': {
    label: ['Standing knee SOFT', 'Foot to the calf or inner thigh — never the knee'],
    // Lifted knee turns out to the side while the foot tucks in against the
    // standing leg — the angles are solved so the ankle lands there.
    a: { torso: 2, near: { thigh: 9, shin: -13, foot: 0 }, far: { thigh: 70, shin: -74, foot: 16 }, arm: { upper: 128, fore: -140 }, contacts: ['toe', 'heel'] },
    b: { torso: 2, near: { thigh: 11, shin: -15, foot: 0 }, far: { thigh: 76, shin: -80, foot: 18 }, arm: { upper: 152, fore: 164 }, contacts: ['toe', 'heel'] },
    focusJoint: 'knee',
    extra: (j) => [
      floorLine(),
      { t: 'line', a: { x: j.hip.x, y: j.hip.y }, b: { x: j.hip.x, y: j.ankle.y }, cls: 'fig-guide' },
      { t: 'text', at: { x: 150, y: 238 }, text: 'if the standing knee locks, rebend it', cls: 'fig-label' }
    ]
  },

  'warrior-two': {
    label: ['Wide stance, front foot forward', 'Front knee over the ankle'],
    a: { torso: 0, near: { thigh: 22, shin: -20, foot: 0 }, far: { thigh: -30, shin: -24, foot: 0 }, arm: { upper: 96, fore: 92 } },
    b: { torso: 0, near: { thigh: 46, shin: -44, foot: 0 }, far: { thigh: -38, shin: -30, foot: 0 }, arm: { upper: 96, fore: 92 } },
    focusJoint: 'knee',
    extra: (j) => [
      floorLine(),
      { t: 'line', a: { x: j.knee.x, y: j.knee.y }, b: { x: j.knee.x, y: GROUND }, cls: 'fig-guide' },
      { t: 'text', at: { x: 150, y: 238 }, text: 'knee stacks over the ankle, not past it', cls: 'fig-label' }
    ]
  }
}

/** A single foot seen from above, pointing "up" the page, rotated by `deg`. */
function foot (at, deg, side, scale = 1) {
  const L = 62 * scale
  const W = 22 * scale
  const s = side === 'left' ? -1 : 1
  const p = (dx, dy) => ({
    x: at.x + (dx * cos(deg) - dy * sin(deg)),
    y: at.y + (dx * sin(deg) + dy * cos(deg))
  })
  return [
    {
      t: 'poly',
      close: true,
      points: [
        p(-W * 0.42, 0), p(-W * 0.5, -L * 0.45), p(-W * 0.34 * s + (s > 0 ? 0 : 0), -L * 0.8),
        p(0, -L), p(W * 0.44, -L * 0.72), p(W * 0.5, -L * 0.2), p(W * 0.3, L * 0.06)
      ].map((q) => ({ x: q.x, y: q.y })),
      cls: 'fig-foot'
    },
    { t: 'line', a: p(0, -L * 0.1), b: p(0, -L * 1.28), cls: 'fig-guide' }
  ]
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

function lerp (a, b, t) {
  if (typeof a === 'number' && typeof b === 'number') return a + (b - a) * t
  if (Array.isArray(a)) return a.map((v, i) => lerp(v, b[i], t))
  if (a && typeof a === 'object' && b && typeof b === 'object') {
    const out = {}
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
      out[k] = k in a && k in b ? lerp(a[k], b[k], t) : (k in a ? a[k] : b[k])
    }
    return out
  }
  return t < 0.5 ? a : b
}

Object.assign(POSES, PACK_POSES)

/**
 * Drawing kit for figures-poses.js, which registers the remaining packs. Kept
 * as a separate file purely for size — the geometry all lives here.
 */
window.PomoptFigureKit = {
  GROUND,
  VIEW,
  SEG,
  sin,
  cos,
  P,
  chain,
  dumbbell,
  floorLine,
  wallAt,
  stepAt,
  stepRight,
  stairsProp,
  chairAt,
  benchProp,
  bikeProp,
  frontBody,
  foot,
  lerpPts,
  keyframe,
  /** Merge more pose definitions into the library. */
  register: (poses) => Object.assign(POSES, poses),
  /** Reuse an existing pose's geometry under a new id and captions. */
  variantOf: (id, label) => ({ ...POSES[id], label: label || POSES[id].label })
}

function elementsFor (spec, t) {
  const pose = lerp(spec.a, spec.b, t)
  if (spec.custom) return spec.draw(pose)

  const j = skeleton(pose)
  const els = [
    ...(spec.props || []),
    ...(spec.extra ? spec.extra(j) : []),
    ...skeletonElements(j, { markKnee: false })
  ]
  const focus = j[spec.focusJoint || 'knee']
  if (focus) els.push({ t: 'circle', c: focus, r: 6, cls: 'fig-focus' })
  return els
}

function makeNode (el) {
  switch (el.t) {
    case 'line': {
      const n = document.createElementNS(NS, 'line')
      n.setAttribute('class', el.cls)
      return n
    }
    case 'circle': {
      const n = document.createElementNS(NS, 'circle')
      n.setAttribute('class', el.cls)
      return n
    }
    case 'poly': {
      const n = document.createElementNS(NS, el.close ? 'polygon' : 'polyline')
      n.setAttribute('class', el.cls)
      return n
    }
    case 'path': {
      const n = document.createElementNS(NS, 'path')
      n.setAttribute('class', el.cls)
      return n
    }
    case 'rect': {
      const n = document.createElementNS(NS, 'rect')
      n.setAttribute('class', el.cls)
      return n
    }
    case 'text': {
      const n = document.createElementNS(NS, 'text')
      n.setAttribute('class', el.cls)
      n.setAttribute('text-anchor', 'middle')
      return n
    }
    default:
      return null
  }
}

function applyNode (node, el) {
  switch (el.t) {
    case 'line':
      node.setAttribute('x1', el.a.x.toFixed(2))
      node.setAttribute('y1', el.a.y.toFixed(2))
      node.setAttribute('x2', el.b.x.toFixed(2))
      node.setAttribute('y2', el.b.y.toFixed(2))
      break
    case 'circle':
      node.setAttribute('cx', el.c.x.toFixed(2))
      node.setAttribute('cy', el.c.y.toFixed(2))
      node.setAttribute('r', el.r)
      break
    case 'poly':
      node.setAttribute('points', el.points.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' '))
      break
    case 'path':
      node.setAttribute('d', el.d)
      break
    case 'rect':
      node.setAttribute('x', el.x.toFixed(2))
      node.setAttribute('y', el.y.toFixed(2))
      node.setAttribute('width', el.w.toFixed(2))
      node.setAttribute('height', el.h)
      node.setAttribute('rx', el.rx)
      break
    case 'text':
      node.setAttribute('x', el.at.x.toFixed(2))
      node.setAttribute('y', el.at.y.toFixed(2))
      if (node.textContent !== el.text) node.textContent = el.text
      break
  }
}

/** Caption for the current phase; supports more than two stages for flows. */
function labelAt (spec, t) {
  if (!spec.label) return ''
  const n = spec.label.length
  return spec.label[Math.min(n - 1, Math.floor(t * n))]
}

const PERIOD_MS = 3200
const HOLD = 0.22 // fraction of each half-cycle spent resting at the end pose

/** Ease that pauses at both ends so the two positions are readable. */
function phase (elapsed) {
  const cycle = (elapsed % PERIOD_MS) / PERIOD_MS
  const half = cycle < 0.5 ? cycle * 2 : (1 - cycle) * 2
  const eased = Math.min(1, Math.max(0, (half - HOLD / 2) / (1 - HOLD)))
  return eased < 0.5 ? 2 * eased * eased : 1 - Math.pow(-2 * eased + 2, 2) / 2
}

/**
 * Build a figure for an exercise.
 * @returns {{el: HTMLElement, destroy: () => void} | null}
 */
function createFigure (exerciseId) {
  const spec = POSES[exerciseId]
  if (!spec) return null

  const wrap = document.createElement('figure')
  wrap.className = 'fig'

  const svg = document.createElementNS(NS, 'svg')
  svg.setAttribute('viewBox', `0 0 ${VIEW.w} ${VIEW.h}`)
  svg.setAttribute('class', 'fig-svg')
  svg.setAttribute('role', 'img')
  svg.setAttribute('aria-label', `Diagram: ${exerciseId.replace(/-/g, ' ')}`)
  wrap.append(svg)

  const caption = document.createElement('figcaption')
  caption.className = 'fig-caption'
  wrap.append(caption)

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  let nodes = []
  const draw = (t) => {
    const els = elementsFor(spec, t)
    if (nodes.length !== els.length) {
      svg.replaceChildren()
      nodes = els.map((el) => {
        const n = makeNode(el)
        if (n) svg.append(n)
        return n
      })
    }
    els.forEach((el, i) => {
      const n = nodes[i]
      if (!n) return
      // Element kinds can change between poses (e.g. 90/90 mirrors); guard.
      if (n.getAttribute('class') !== el.cls) n.setAttribute('class', el.cls)
      applyNode(n, el)
    })
    caption.textContent = labelAt(spec, t)
  }

  let raf = null
  let start = null
  // Draw once synchronously so the figure is present the moment it is mounted,
  // rather than one animation frame later (or never, if rAF is throttled).
  draw(reduced ? 1 : 0)
  if (!reduced) {
    const step = (now) => {
      if (start === null) start = now
      draw(phase(now - start))
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
  }

  return {
    el: wrap,
    destroy () {
      if (raf) cancelAnimationFrame(raf)
      raf = null
    }
  }
}

/** Non-animating build of a single pose — used by the figure contact sheet. */
function createStatic (exerciseId, t) {
  const spec = POSES[exerciseId]
  if (!spec) return null

  const wrap = document.createElement('figure')
  wrap.className = 'fig'

  const svg = document.createElementNS(NS, 'svg')
  svg.setAttribute('viewBox', `0 0 ${VIEW.w} ${VIEW.h}`)
  svg.setAttribute('class', 'fig-svg')
  wrap.append(svg)

  for (const el of elementsFor(spec, t)) {
    const n = makeNode(el)
    if (!n) continue
    applyNode(n, el)
    svg.append(n)
  }

  const caption = document.createElement('figcaption')
  caption.className = 'fig-caption'
  caption.textContent = labelAt(spec, t)
  wrap.append(caption)

  return wrap
}

window.PomoptFigures = {
  createFigure,
  createStatic,
  hasFigure: (id) => !!POSES[id],
  ids: () => Object.keys(POSES),
  /** How many captioned stages a figure has; 2 for a plain start/end pair. */
  stageCount: (id) => (POSES[id] && POSES[id].label ? POSES[id].label.length : 2)
}
