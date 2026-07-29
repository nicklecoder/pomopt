'use strict'

/**
 * Diagrams for the strength, core, stretching, cardio and yoga packs.
 *
 * Split out from figures.js purely for size — all the geometry, the parametric
 * skeleton and the props live there and arrive via window.PomoptFigureKit.
 *
 * Each entry is either:
 *   - a skeleton pose pair (`a` / `b` of joint angles), or
 *   - `custom: true` with a `draw(pose)` that returns element specs, used where
 *     a side-on skeleton is the wrong view: lying down, seen from above, or
 *     seen from the front.
 */

;(function () {
  const K = window.PomoptFigureKit
  const {
    GROUND, VIEW, SEG, P, chain, dumbbell, floorLine, wallAt, stepAt, stepRight,
    stairsProp, chairAt, benchProp, bikeProp, frontBody, keyframe, variantOf
  } = K

  /**
   * Chair with the backrest on the LEFT, so the sitter faces +x like the
   * skeleton does. Returns an array so it spreads like the other multi-part
   * props (benchProp, frontBody).
   */
  const chairL = (seatX, seatY) => [{
    t: 'poly',
    points: [
      P(seatX - 30, seatY - 62),
      P(seatX - 30, seatY),
      P(seatX + 56, seatY),
      P(seatX + 56, GROUND)
    ],
    cls: 'fig-prop'
  }]

  const note = (text, y = 238) => ({ t: 'text', at: P(150, y), text, cls: 'fig-label' })
  const above = () => note('seen from above', 26)
  const front = () => note('seen from the front', 26)
  const head = (at) => ({ t: 'circle', c: at, r: SEG.headR, cls: 'fig-head' })
  const focus = (at) => ({ t: 'circle', c: at, r: 6, cls: 'fig-focus' })
  const guide = (a, b) => ({ t: 'line', a, b, cls: 'fig-guide' })

  const mix = (a, b, u) => a + (b - a) * u

  K.register({
    // =====================================================================
    // UPPER BODY
    // =====================================================================
    'desk-pushup': {
      label: ['Arms straight, body in one line', 'Lower the chest to the desk'],
      custom: true,
      a: { u: 0 },
      b: { u: 1 },
      draw: (p) => {
        const hand = P(174, 122)
        const shoulder = P(mix(150, 156, p.u), mix(154, 172, p.u))
        const elbow = P(mix(164, 182, p.u), mix(138, 152, p.u))
        const hip = P(mix(106, 108, p.u), mix(184, 190, p.u))
        const ankle = P(64, 206)
        return [
          floorLine(),
          { t: 'line', a: P(150, 122), b: P(VIEW.w - 8, 122), cls: 'fig-prop' },
          { t: 'line', a: P(VIEW.w - 20, 122), b: P(VIEW.w - 20, GROUND), cls: 'fig-prop' },
          ...chain([P(52, GROUND), ankle, hip, shoulder]),
          ...chain([shoulder, elbow, hand]),
          head(P(shoulder.x + 7, shoulder.y - 21)),
          guide(shoulder, ankle),
          focus(hip),
          note('hips ride on the dashed line')
        ]
      }
    },

    pushup: {
      label: ['Arms straight', 'Chest a fist off the floor'],
      custom: true,
      a: { u: 0 },
      b: { u: 1 },
      draw: (p) => {
        const hand = P(94, GROUND)
        const shoulder = P(106, mix(158, 190, p.u))
        const elbow = P(mix(100, 134, p.u), mix(190, 198, p.u))
        const hip = P(172, mix(180, 192, p.u))
        const ankle = P(232, mix(200, 202, p.u))
        return [
          floorLine(),
          ...chain([shoulder, hip, ankle, P(244, GROUND)]),
          ...chain([shoulder, elbow, hand]),
          head(P(88, shoulder.y - 10)),
          guide(shoulder, ankle),
          focus(hip),
          note('elbows about 45° from the ribs, not flared')
        ]
      }
    },

    'db-floor-press': {
      label: ['Triceps resting on the floor', 'Press up — stop short of locking'],
      custom: true,
      a: { u: 0 },
      b: { u: 1 },
      draw: (p) => {
        const shoulder = P(100, 198)
        const hip = P(160, 198)
        const elbow = P(mix(98, 102, p.u), mix(210, 166, p.u))
        const hand = P(mix(104, 108, p.u), mix(166, 118, p.u))
        return [
          floorLine(),
          ...chain([shoulder, hip, P(198, 160), P(222, 200)]),
          ...chain([shoulder, elbow, hand]),
          head(P(80, 194)),
          dumbbell(hand),
          guide(P(126, GROUND - 3), P(186, GROUND - 3)),
          focus(P(148, 200)),
          note('ribs down — do not arch to press')
        ]
      }
    },

    'db-bench-press': {
      label: ['Dumbbells at chest level', 'Press up and slightly together'],
      custom: true,
      a: { u: 0 },
      b: { u: 1 },
      draw: (p) => {
        const shoulder = P(112, 158)
        const elbow = P(mix(98, 110, p.u), mix(138, 120, p.u))
        const hand = P(mix(132, 118, p.u), mix(130, 94, p.u))
        return [
          floorLine(),
          ...benchProp(72, 232, 170),
          ...chain([shoulder, P(182, 158), P(206, 184), P(212, GROUND)]),
          ...chain([shoulder, elbow, hand]),
          head(P(88, 154)),
          dumbbell(hand),
          focus(shoulder),
          note('shoulder blades pinned back and down')
        ]
      }
    },

    'db-incline-press': {
      label: ['Bench at 30–45°', 'Press up — head and back stay in contact'],
      custom: true,
      a: { u: 0 },
      b: { u: 1 },
      draw: (p) => {
        const shoulder = P(168, 146)
        const elbow = P(mix(158, 176, p.u), mix(172, 132, p.u))
        const hand = P(mix(186, 194, p.u), mix(166, 108, p.u))
        return [
          floorLine(),
          ...benchProp(78, 214, 198, 66),
          ...chain([shoulder, P(110, 186), P(96, 208), P(92, GROUND)]),
          ...chain([shoulder, elbow, hand]),
          head(P(186, 134)),
          dumbbell(hand),
          note('steeper than 45° becomes a shoulder press')
        ]
      }
    },

    'db-flye': {
      label: ['Arms above the chest, soft elbows', 'Open wide until the chest stretches'],
      custom: true,
      a: { u: 0 },
      b: { u: 1 },
      draw: (p) => {
        const shoulderY = 104
        const els = [
          above(),
          { t: 'line', a: P(132, 68), b: P(132, 206), cls: 'fig-prop' },
          { t: 'line', a: P(168, 68), b: P(168, 206), cls: 'fig-prop' },
          { t: 'line', a: P(124, shoulderY), b: P(176, shoulderY), cls: 'fig-limb' },
          { t: 'line', a: P(150, shoulderY), b: P(150, 184), cls: 'fig-limb' },
          head(P(150, 84))
        ]
        for (const s of [-1, 1]) {
          const elbow = P(150 + s * mix(20, 42, p.u), mix(120, 122, p.u))
          const hand = P(150 + s * mix(7, 74, p.u), mix(130, 116, p.u))
          els.push(...chain([P(150 + s * 26, shoulderY), elbow, hand]))
          els.push(dumbbell(hand))
        }
        els.push(note('lighter than you press with'))
        return els
      }
    },

    'band-pull-apart': {
      label: ['Arms out in front, hands together', 'Pull apart — squeeze the shoulder blades'],
      custom: true,
      a: { u: 0 },
      b: { u: 1 },
      draw: (p) => {
        const shoulderY = 142
        const els = [
          above(),
          { t: 'line', a: P(122, shoulderY), b: P(178, shoulderY), cls: 'fig-limb' },
          { t: 'line', a: P(150, shoulderY), b: P(150, 200), cls: 'fig-limb' },
          head(P(150, 134))
        ]
        const hands = []
        for (const s of [-1, 1]) {
          const elbow = P(150 + s * mix(20, 48, p.u), mix(96, 106, p.u))
          const hand = P(150 + s * mix(13, 80, p.u), mix(62, 66, p.u))
          hands.push(hand)
          els.push(...chain([P(150 + s * 28, shoulderY), elbow, hand]))
        }
        els.push({
          t: 'path',
          d: `M ${hands[0].x.toFixed(1)} ${hands[0].y.toFixed(1)} Q 150 ${(hands[0].y - 14).toFixed(1)} ${hands[1].x.toFixed(1)} ${hands[1].y.toFixed(1)}`,
          cls: 'fig-band'
        })
        els.push(note('do not shrug — the work is between the blades'))
        return els
      }
    },

    'db-row-single': {
      label: ['Arm long, shoulder stretched down', 'Row to the HIP, elbow leading'],
      custom: true,
      a: { u: 0 },
      b: { u: 1 },
      draw: (p) => {
        const shoulder = P(120, 150)
        const hip = P(188, 158)
        const elbow = P(mix(138, 162, p.u), mix(180, 168, p.u))
        const hand = P(mix(144, 160, p.u), mix(204, 150, p.u))
        return [
          floorLine(),
          ...benchProp(92, 240, 170),
          ...chain([shoulder, hip, P(198, 188), P(202, GROUND)]),
          ...chain([hip, P(176, 166)], 'fig-far'),
          ...chain([shoulder, P(124, 170)], 'fig-far'),
          ...chain([shoulder, elbow, hand]),
          head(P(102, 144)),
          dumbbell(hand),
          guide(shoulder, hip),
          note('back stays flat and level — no twisting')
        ]
      }
    },

    'db-pullover': {
      label: ['Dumbbell over the chest', 'Back over the head until the lats stretch'],
      custom: true,
      a: { u: 0 },
      b: { u: 1 },
      draw: (p) => {
        const shoulder = P(112, 158)
        const elbow = P(mix(104, 88, p.u), mix(122, 140, p.u))
        const hand = P(mix(116, 68, p.u), mix(100, 128, p.u))
        return [
          floorLine(),
          ...benchProp(72, 232, 170),
          ...chain([shoulder, P(182, 158), P(206, 184), P(212, GROUND)]),
          ...chain([shoulder, elbow, hand]),
          head(P(94, 154)),
          dumbbell(hand, true),
          focus(P(126, 150)),
          note('ribs stay down — no arching off the bench')
        ]
      }
    },

    pullup: {
      label: ['Hang, shoulders pulled down', 'Chest to the bar'],
      custom: true,
      a: { u: 0 },
      b: { u: 1 },
      draw: (p) => {
        const hand = P(150, 34)
        const shoulder = P(150, mix(112, 74, p.u))
        const elbow = P(mix(150, 126, p.u), mix(72, 62, p.u))
        const hip = P(150, mix(170, 132, p.u))
        const knee = P(mix(162, 166, p.u), mix(202, 164, p.u))
        const ankle = P(mix(146, 150, p.u), mix(218, 180, p.u))
        return [
          { t: 'line', a: P(86, 34), b: P(214, 34), cls: 'fig-prop' },
          ...chain([hand, elbow, shoulder]),
          ...chain([shoulder, hip, knee, ankle]),
          head(P(150, mix(92, 54, p.u))),
          note('lower over 3 seconds')
        ]
      }
    },

    'db-lateral-raise': {
      label: ['Dumbbells at your sides', 'Out to shoulder height — no higher'],
      custom: true,
      a: { u: 0 },
      b: { u: 1 },
      draw: (p) => {
        const shoulderY = 92
        const els = [
          front(),
          ...frontBody(150, 62, shoulderY, 148, [], [[2, 32], [4, 66]]),
          guide(P(96, shoulderY), P(204, shoulderY))
        ]
        for (const s of [-1, 1]) {
          const elbow = P(150 + s * mix(28, 52, p.u), mix(120, 96, p.u))
          const hand = P(150 + s * mix(31, 80, p.u), mix(148, 94, p.u))
          els.push(...chain([P(150 + s * 26, shoulderY), elbow, hand]))
          els.push(dumbbell(hand))
        }
        els.push(note('lead with the elbows, and do not shrug'))
        return els
      }
    },

    'db-rear-delt-flye': {
      label: ['Hinged forward, arms hanging', 'Open wide to shoulder height'],
      custom: true,
      a: { u: 0 },
      b: { u: 1 },
      draw: (p) => {
        const shoulderY = 112
        const els = [
          note('seen from the front, hinged forward', 26),
          { t: 'line', a: P(118, shoulderY), b: P(182, shoulderY), cls: 'fig-limb' },
          { t: 'line', a: P(150, shoulderY), b: P(150, 142), cls: 'fig-limb' },
          head(P(150, 160)),
          guide(P(100, shoulderY), P(200, shoulderY))
        ]
        for (const s of [-1, 1]) {
          const elbow = P(150 + s * mix(32, 58, p.u), mix(142, 118, p.u))
          const hand = P(150 + s * mix(34, 86, p.u), mix(172, 112, p.u))
          els.push(...chain([P(150 + s * 32, shoulderY), elbow, hand]))
          els.push(dumbbell(hand))
        }
        els.push(note('pull the shoulder blades apart, then together'))
        return els
      }
    },

    'db-curl': {
      label: ['Arm nearly straight, elbow at the ribs', 'Curl up — elbow does not drift'],
      a: { torso: 2, near: { thigh: 7, shin: -11, foot: 0 }, far: { thigh: 7, shin: -11, foot: 0 }, arm: { upper: 8, fore: 6 } },
      b: { torso: 2, near: { thigh: 7, shin: -11, foot: 0 }, far: { thigh: 7, shin: -11, foot: 0 }, arm: { upper: 12, fore: 122 } },
      focusJoint: 'elbow',
      extra: (j) => [floorLine(), dumbbell(j.hand), note('lower over 3 seconds')]
    },

    'db-hammer-curl': {
      label: ['Palms facing each other', 'Curl up keeping the palms inward'],
      custom: true,
      a: { u: 0 },
      b: { u: 1 },
      draw: (p) => {
        const shoulderY = 92
        const els = [
          front(),
          ...frontBody(150, 62, shoulderY, 148, [], [[2, 32], [4, 66]])
        ]
        for (const s of [-1, 1]) {
          const elbow = P(150 + s * 30, 126)
          const hand = P(150 + s * mix(32, 26, p.u), mix(154, 108, p.u))
          els.push(...chain([P(150 + s * 26, shoulderY), elbow, hand]))
          // Vertical dumbbell = neutral grip; that is the whole distinction.
          els.push(dumbbell(hand, true))
        }
        els.push(note('dumbbells stay vertical, like hammers'))
        return els
      }
    },

    'db-preacher-curl': {
      label: ['Arm nearly straight along the pad', 'Curl up — back of the arm stays glued'],
      custom: true,
      a: { u: 0 },
      b: { u: 1 },
      draw: (p) => {
        const shoulder = P(188, 116)
        const elbow = P(122, 152)
        const hand = P(mix(112, 158, p.u), mix(198, 118, p.u))
        return [
          floorLine(),
          // Sloped preacher pad plus the seat behind it.
          { t: 'line', a: P(108, 162), b: P(200, 108), cls: 'fig-prop' },
          { t: 'line', a: P(150, 136), b: P(150, GROUND), cls: 'fig-prop' },
          ...chairL(232, 168),
          ...chain([shoulder, P(226, 158), P(250, 186), P(254, GROUND)]),
          ...chain([shoulder, elbow, hand]),
          head(P(196, 96)),
          dumbbell(hand),
          focus(elbow),
          note('never bounce out of the straight-arm position')
        ]
      }
    },

    'db-overhead-triceps': {
      label: ['Dumbbell overhead, arms nearly straight', 'Bend only at the elbows'],
      a: { torso: 2, near: { thigh: 7, shin: -11, foot: 0 }, far: { thigh: 7, shin: -11, foot: 0 }, arm: { upper: 176, fore: 180 } },
      b: { torso: 2, near: { thigh: 7, shin: -11, foot: 0 }, far: { thigh: 7, shin: -11, foot: 0 }, arm: { upper: 176, fore: 246 } },
      focusJoint: 'elbow',
      extra: (j) => [
        floorLine(),
        dumbbell(j.hand, true),
        guide(j.shoulder, j.elbow),
        note('upper arms stay pointing at the ceiling')
      ]
    },

    // =====================================================================
    // CORE
    // =====================================================================
    'hollow-hold': {
      label: ['Lying flat', 'Shoulders and legs up, back still pressed down'],
      custom: true,
      a: { u: 0 },
      b: { u: 1 },
      draw: (p) => {
        const shoulder = P(100, mix(204, 186, p.u))
        const hip = P(160, mix(204, 202, p.u))
        const knee = P(208, mix(196, 184, p.u))
        const ankle = P(242, mix(206, 174, p.u))
        return [
          floorLine(),
          ...chain([shoulder, hip, knee, ankle]),
          ...chain([shoulder, P(mix(74, 78, p.u), mix(206, 176, p.u))]),
          head(P(mix(82, 84, p.u), mix(200, 180, p.u))),
          guide(P(128, GROUND - 3), P(192, GROUND - 3)),
          focus(P(150, mix(206, 204, p.u))),
          note('the lower back never leaves the floor')
        ]
      }
    },

    'seated-knee-tuck': {
      label: ['Lean back, feet off the floor', 'Draw the knees toward the chest'],
      custom: true,
      a: { u: 0 },
      b: { u: 1 },
      draw: (p) => {
        const hip = P(150, 156)
        const knee = P(mix(202, 176, p.u), mix(164, 138, p.u))
        const ankle = P(mix(212, 204, p.u), mix(202, 128, p.u))
        const shoulder = P(120, 108)
        return [
          floorLine(),
          ...chairL(150, 168),
          ...chain([shoulder, hip, knee, ankle]),
          ...chain([shoulder, P(150, 130)]),
          head(P(110, 90)),
          focus(P(138, 138)),
          note('slow and controlled — do not rock')
        ]
      }
    },

    'reverse-crunch': {
      label: ['Knees bent over the hips', 'Curl the tailbone up off the floor'],
      custom: true,
      a: { u: 0 },
      b: { u: 1 },
      draw: (p) => {
        const shoulder = P(100, 200)
        const hip = P(160, mix(200, 190, p.u))
        const knee = P(mix(198, 172, p.u), mix(156, 148, p.u))
        const ankle = P(mix(226, 152, p.u), mix(170, 130, p.u))
        return [
          floorLine(),
          ...chain([shoulder, hip, knee, ankle]),
          ...chain([shoulder, P(76, 208)]),
          head(P(82, 196)),
          focus(hip),
          note('the pelvis moves, not the legs')
        ]
      }
    },

    'pallof-press': {
      label: ['Hands at the chest', 'Press out — do not let the band twist you'],
      custom: true,
      a: { u: 0 },
      b: { u: 1 },
      draw: (p) => {
        const shoulderY = 104
        const hand = P(150, mix(86, 42, p.u))
        const anchor = P(276, 128)
        return [
          above(),
          { t: 'line', a: P(124, shoulderY), b: P(176, shoulderY), cls: 'fig-limb' },
          { t: 'line', a: P(150, shoulderY), b: P(150, 176), cls: 'fig-limb' },
          head(P(150, 78)),
          ...chain([P(126, shoulderY), P(mix(140, 146, p.u), mix(94, 62, p.u)), hand]),
          ...chain([P(174, shoulderY), P(mix(160, 154, p.u), mix(94, 62, p.u)), hand]),
          { t: 'path', d: `M ${hand.x} ${hand.y} Q ${(hand.x + anchor.x) / 2} ${hand.y - 10} ${anchor.x} ${anchor.y}`, cls: 'fig-band' },
          { t: 'line', a: anchor, b: P(anchor.x, 176), cls: 'fig-prop' },
          guide(P(104, shoulderY), P(196, shoulderY)),
          note('shoulders stay square to the dashed line')
        ]
      }
    },

    'side-plank': {
      label: ['Hips sagging — this is the failure', 'One straight line — hold this'],
      custom: true,
      a: { sag: 22 },
      b: { sag: 0 },
      draw: (p) => {
        const elbow = P(96, GROUND)
        const shoulder = P(106, 158)
        const hip = P(170, 180 + p.sag)
        const ankle = P(232, 202)
        return [
          floorLine(),
          ...chain([P(70, GROUND), elbow, shoulder]),
          ...chain([shoulder, hip, ankle, P(244, GROUND)]),
          ...chain([shoulder, P(114, 118)], 'fig-far'),
          head(P(90, 146)),
          guide(shoulder, ankle),
          focus(hip),
          note('push the bottom shoulder away from your ear')
        ]
      }
    },

    'db-suitcase-carry': {
      label: ['Leaning away from the weight — wrong', 'Shoulders level — walk like this'],
      custom: true,
      a: { tilt: 1 },
      b: { tilt: 0 },
      draw: (p) => {
        const shY = 96
        const l = P(124, shY + 9 * p.tilt)
        const r = P(176, shY - 9 * p.tilt)
        const hand = P(190, 150)
        return [
          front(),
          guide(P(100, shY), P(200, shY)),
          { t: 'line', a: l, b: r, cls: 'fig-limb' },
          { t: 'line', a: P(150, shY), b: P(150, 150), cls: 'fig-limb' },
          { t: 'line', a: P(133, 150), b: P(167, 150), cls: 'fig-limb' },
          ...chain([r, P(184, 122), hand]),
          ...chain([l, P(116, 122), P(112, 150)]),
          ...chain([P(133, 150), P(129, 182), P(127, GROUND)]),
          ...chain([P(167, 150), P(171, 182), P(173, GROUND)]),
          head(P(150, 62)),
          dumbbell(hand, true),
          focus(r),
          note('one heavy side — refuse to bend toward it')
        ]
      }
    },

    'bird-dog': {
      label: ['Flat back, balance a mug on it', 'Extend to horizontal — no higher'],
      custom: true,
      a: { u: 0 },
      b: { u: 1 },
      draw: (p) => {
        const shoulder = P(124, 150)
        const hip = P(190, 150)
        const knee = P(mix(200, 236, p.u), mix(184, 154, p.u))
        const ankle = P(mix(214, 268, p.u), mix(GROUND, 150, p.u))
        const elbow = P(mix(112, 88, p.u), mix(180, 152, p.u))
        const hand = P(mix(114, 44, p.u), mix(GROUND, 148, p.u))
        return [
          floorLine(),
          ...chain([shoulder, hip]),
          ...chain([hip, P(200, 184), P(204, GROUND)], 'fig-far'),
          ...chain([shoulder, P(132, 182), P(136, GROUND)], 'fig-far'),
          ...chain([hip, knee, ankle]),
          ...chain([shoulder, elbow, hand]),
          head(P(106, 142)),
          guide(P(112, 148), P(200, 148)),
          note('do not let the hips rotate or the back arch')
        ]
      }
    },

    'prone-superman': {
      label: ['Lying face down', 'Squeeze the glutes, lift the chest a little'],
      custom: true,
      a: { u: 0 },
      b: { u: 1 },
      draw: (p) => {
        const shoulder = P(112, mix(204, 190, p.u))
        const hip = P(182, 204)
        const ankle = P(244, mix(206, 196, p.u))
        return [
          floorLine(),
          ...chain([shoulder, hip, P(216, 206), ankle]),
          ...chain([shoulder, P(84, mix(208, 190, p.u))]),
          head(P(mix(92, 90, p.u), mix(200, 184, p.u))),
          focus(hip),
          note('glutes squeeze before anything lifts')
        ]
      }
    },

    // =====================================================================
    // LOWER BODY
    // =====================================================================
    'db-step-up': {
      label: ['Whole foot on the step', 'Drive through that heel to stand up'],
      custom: true,
      a: { u: 0 },
      b: { u: 1 },
      draw: (p) => {
        const stepTop = GROUND - 30
        const hip = P(mix(126, 190, p.u), mix(128, 100, p.u))
        const shoulder = P(hip.x - 2, hip.y - 56)
        const knee = P(mix(162, 194, p.u), mix(158, 146, p.u))
        const ankle = P(192, stepTop)
        const trailKnee = P(mix(118, 210, p.u), mix(168, 150, p.u))
        const trailAnkle = P(mix(112, 216, p.u), mix(GROUND, stepTop, p.u))
        return [
          floorLine(),
          stepRight(168, 30),
          ...chain([hip, trailKnee, trailAnkle], 'fig-far'),
          ...chain([hip, knee, ankle]),
          ...chain([hip, shoulder]),
          ...chain([shoulder, P(shoulder.x + 6, shoulder.y + 26), P(shoulder.x + 10, shoulder.y + 52)]),
          head(P(shoulder.x - 2, shoulder.y - 22)),
          dumbbell(P(shoulder.x + 10, shoulder.y + 52)),
          focus(knee),
          note('do not push off the trailing foot')
        ]
      }
    },

    'db-calf-raise': {
      label: ['Heels dropped below the step', 'Rise as high as you can, hold'],
      custom: true,
      a: { u: 0 },
      b: { u: 1 },
      // Close-up of one foot: a whole standing figure rising onto its toes
      // pushes the head out of frame, and the ankle range is the whole point.
      draw: (p) => {
        const stepTop = 168
        const ball = P(198, stepTop)
        const ankle = P(184, mix(stepTop - 16, stepTop - 48, p.u))
        const heel = P(mix(164, 162, p.u), mix(stepTop + 26, stepTop - 20, p.u))
        const knee = P(176, ankle.y - 70)
        return [
          floorLine(),
          { t: 'poly', points: [P(8, stepTop), P(210, stepTop), P(210, GROUND)], cls: 'fig-prop' },
          ...chain([P(174, knee.y - 26), knee, ankle]),
          ...chain([heel, ankle, ball]),
          focus(heel),
          note('close-up of one foot at the step edge', 26),
          note('full stretch down, full squeeze up')
        ]
      }
    },

    'seated-calf-raise': {
      label: ['Feet flat, knees bent 90°', 'Push through the balls of the feet'],
      custom: true,
      a: { u: 0 },
      b: { u: 1 },
      draw: (p) => {
        const hip = P(146, 156)
        const knee = P(206, 158)
        const ankle = P(210, mix(206, 188, p.u))
        const heel = P(mix(196, 200, p.u), mix(GROUND, 186, p.u))
        const toe = P(232, GROUND)
        return [
          floorLine(),
          ...chairL(146, 168),
          ...chain([P(132, 100), hip, knee, ankle]),
          ...chain([heel, ankle, toe]),
          head(P(126, 78)),
          dumbbell(P(178, 148)),
          focus(heel),
          note('bent knee targets the soleus under the calf')
        ]
      }
    },

    // =====================================================================
    // STRETCHING
    // =====================================================================
    'seated-figure-four-stretch': variantOf('figure-four', [
      'Ankle across the opposite knee',
      'Hinge forward from the hips'
    ]),

    'standing-calf-stretch-stretch': variantOf('gastroc-stretch', [
      'Back leg straight, heel pressed down',
      'Lean the hips toward the wall'
    ]),

    'standing-quad-stretch': {
      label: ['Stand tall, standing knee SOFT', 'Tuck the tail, squeeze that glute'],
      a: { torso: 2, near: { thigh: 8, shin: -12, foot: 0 }, far: { thigh: -6, shin: -150, foot: -40 }, arm: { upper: 12, fore: 16 }, farArm: { upper: -26, fore: -14 }, contacts: ['toe', 'heel'] },
      b: { torso: -6, near: { thigh: 10, shin: -14, foot: 0 }, far: { thigh: -14, shin: -158, foot: -40 }, arm: { upper: 12, fore: 16 }, farArm: { upper: -30, fore: -18 }, contacts: ['toe', 'heel'] },
      focusJoint: 'hip',
      extra: () => [floorLine(), note('knees stay close together, not splayed')]
    },

    'gentle-hamstring-stretch': {
      label: ['Heel on the seat, BOTH knees soft', 'Hinge forward — mild is the target'],
      a: { torso: 14, near: { thigh: 8, shin: -12, foot: 0 }, far: { thigh: 70, shin: 40, foot: 30 }, arm: { upper: 16, fore: 20 }, contacts: ['toe', 'heel'], ground: false, hipX: 116, hipY: 120 },
      b: { torso: 44, near: { thigh: 9, shin: -13, foot: 0 }, far: { thigh: 70, shin: 40, foot: 30 }, arm: { upper: 8, fore: 12 }, contacts: ['toe', 'heel'], ground: false, hipX: 116, hipY: 120 },
      focusJoint: 'farKnee',
      extra: () => [floorLine(), chairAt(212, 172), note('never straighten the raised leg fully')]
    },

    'couch-stretch': {
      label: ['Back shin flat against the wall', 'Tuck the tail HARD, come upright'],
      custom: true,
      a: { u: 0 },
      b: { u: 1 },
      draw: (p) => {
        const knee = P(78, GROUND)
        const hip = P(100, 158)
        const shoulder = P(mix(122, 102, p.u), mix(116, 104, p.u))
        return [
          floorLine(),
          wallAt(56),
          ...chain([P(58, 168), knee, hip]),
          ...chain([hip, P(154, 180), P(160, GROUND)]),
          ...chain([hip, shoulder]),
          ...chain([shoulder, P(shoulder.x + 20, shoulder.y + 26)]),
          head(P(shoulder.x + 4, shoulder.y - 20)),
          focus(hip),
          note('breathe evenly — back off if you cannot')
        ]
      }
    },

    'doorway-chest-stretch': {
      label: ['Forearms on the frame, elbows at shoulder height', 'Step through, let the chest travel forward'],
      custom: true,
      a: { u: 0 },
      b: { u: 1 },
      draw: (p) => {
        const shoulder = P(mix(150, 170, p.u), 112)
        const elbow = P(114, 112)
        const hand = P(106, 84)
        const hip = P(mix(146, 160, p.u), 168)
        return [
          floorLine(),
          { t: 'line', a: P(100, 18), b: P(100, GROUND), cls: 'fig-prop' },
          ...chain([shoulder, elbow, hand]),
          ...chain([shoulder, hip, P(hip.x + 6, 190), P(hip.x + 10, GROUND)]),
          ...chain([hip, P(hip.x - 14, 190), P(hip.x - 18, GROUND)], 'fig-far'),
          head(P(shoulder.x + 8, 90)),
          focus(shoulder),
          note('ribs down — do not arch for more')
        ]
      }
    },

    'cross-body-shoulder': {
      label: ['Arm straight across the chest', 'Draw it in by the UPPER arm'],
      custom: true,
      a: { u: 0 },
      b: { u: 1 },
      draw: (p) => {
        const shY = 100
        const hand = P(mix(104, 92, p.u), mix(104, 100, p.u))
        return [
          front(),
          ...frontBody(150, 66, shY, 152, [], [[2, 30], [4, 62]], { halfShoulder: 28 }),
          ...chain([P(178, shY), P(140, mix(104, 100, p.u)), hand]),
          ...chain([P(122, shY), P(112, mix(126, 120, p.u)), P(mix(126, 118, p.u), mix(118, 110, p.u))]),
          focus(P(150, shY + 4)),
          note('pull on the upper arm, never the elbow joint')
        ]
      }
    },

    'thread-the-needle': {
      label: ['Hands and knees, hips over the knees', 'Slide one arm under, shoulder to the floor'],
      custom: true,
      a: { u: 0 },
      b: { u: 1 },
      draw: (p) => {
        const knee = P(200, GROUND)
        const hip = P(192, 152)
        const shoulder = P(126, mix(152, 186, p.u))
        return [
          floorLine(),
          ...chain([P(232, GROUND - 4), knee, hip]),
          ...chain([hip, shoulder]),
          ...chain([shoulder, P(140, 184), P(146, GROUND)], 'fig-far'),
          ...chain([shoulder, P(mix(112, 96, p.u), mix(184, 206, p.u)), P(mix(108, 60, p.u), mix(GROUND, 208, p.u))]),
          head(P(mix(106, 100, p.u), mix(142, 200, p.u))),
          focus(shoulder),
          note('hips stay stacked over the knees')
        ]
      }
    },

    'cat-cow': {
      label: ['Cow — belly drops, chest and tail lift', 'Cat — round up, tuck the tail'],
      custom: true,
      a: { arc: 1 },
      b: { arc: -1 },
      draw: (p) => {
        const shoulder = P(114, 152)
        const hip = P(196, 152)
        const ctrlY = 152 + 26 * p.arc
        return [
          floorLine(),
          { t: 'path', d: `M ${shoulder.x} ${shoulder.y} Q 155 ${ctrlY.toFixed(1)} ${hip.x} ${hip.y}`, cls: 'fig-limb' },
          ...chain([shoulder, P(104, 184), P(98, GROUND)]),
          ...chain([hip, P(204, 184), P(208, GROUND)]),
          ...chain([hip, P(216, 140 - 10 * p.arc)]),
          head(P(100, 148 - 20 * p.arc)),
          note('one vertebra at a time, with the breath')
        ]
      }
    },

    'seated-spinal-twist': {
      label: ['Sitting square', 'Grow taller, THEN rotate'],
      custom: true,
      a: { rot: 0 },
      b: { rot: 34 },
      draw: (p) => {
        const cx = 150
        const shY = 92
        const half = 30
        const l = P(cx - half * K.cos(p.rot), shY - half * K.sin(p.rot))
        const r = P(cx + half * K.cos(p.rot), shY + half * K.sin(p.rot))
        return [
          above(),
          guide(P(cx - half, shY), P(cx + half, shY)),
          { t: 'line', a: l, b: r, cls: 'fig-limb' },
          { t: 'line', a: P(cx, shY), b: P(cx, 158), cls: 'fig-limb' },
          { t: 'line', a: P(cx - 22, 158), b: P(cx + 22, 158), cls: 'fig-limb' },
          head(P(cx, 60)),
          focus(P(cx, 124)),
          note('both sitting bones stay on the seat')
        ]
      }
    },

    'neck-side-stretch': {
      label: ['Sit tall, shoulders level', 'Ear toward the shoulder — hand rests, does not pull'],
      custom: true,
      a: { u: 0 },
      b: { u: 1 },
      draw: (p) => {
        const shY = 118
        const headC = P(150 - 26 * p.u, 78 - 2 * p.u)
        return [
          front(),
          { t: 'line', a: P(120, shY), b: P(180, shY), cls: 'fig-limb' },
          { t: 'line', a: P(150, shY), b: P(150, 176), cls: 'fig-limb' },
          ...chain([P(150, shY - 4), headC]),
          head(headC),
          ...chain([P(180, shY), P(190, 146), P(186, 176)]),
          ...chain([P(120, shY), P(mix(110, 118, p.u), mix(146, 108, p.u)), P(mix(114, 138, p.u), mix(176, 76, p.u))]),
          focus(P(168, shY - 6)),
          note('stretched-side shoulder stays DOWN')
        ]
      }
    },

    'chin-tuck': {
      label: ['Head drifted forward', 'Slide it straight back — not a nod'],
      custom: true,
      a: { u: 0 },
      b: { u: 1 },
      draw: (p) => {
        const shoulder = P(140, 150)
        const headC = P(mix(176, 146, p.u), 100)
        return [
          note('seen from the side', 26),
          guide(P(146, 62), P(146, 190)),
          ...chain([shoulder, P(140, 190)]),
          ...chain([P(146, 132), headC]),
          head(headC),
          { t: 'line', a: P(120, 150), b: P(160, 150), cls: 'fig-limb' },
          focus(P(146, 126)),
          note('the head slides back along the dashed line')
        ]
      }
    },

    'wrist-forearm-stretch': {
      label: ['Palm out, fingers drawn back', 'Then flip: fingers down, palm toward you'],
      custom: true,
      a: { u: 0 },
      b: { u: 1 },
      draw: (p) => {
        const shoulder = P(66, 116)
        const wrist = P(188, 126)
        // Fingers swing from pointing up (palm out) to pointing down.
        const tip = P(200, mix(88, 168, p.u))
        // The assisting hand meets the fingertips from the far side.
        const assist = P(246, mix(146, 100, p.u))
        const assistTip = P(214, mix(100, 156, p.u))
        return [
          note('one arm out straight, elbow not locked hard', 26),
          ...chain([shoulder, P(128, 122), wrist]),
          ...chain([wrist, tip]),
          ...chain([assist, assistTip], 'fig-far'),
          head(P(56, 90)),
          focus(wrist),
          note('gravity and a light hand — no cranking')
        ]
      }
    },

    // =====================================================================
    // CARDIO
    // =====================================================================
    'bike-easy-spin': {
      label: ['Pedal at the top', 'Knee stays SOFT at the bottom'],
      custom: true,
      a: { crank: 0 },
      b: { crank: 180 },
      draw: (p) => {
        const bike = bikeProp(p.crank)
        const hip = P(128, 118)
        const shoulder = P(158, 74)
        const knee = P((hip.x + bike.pedal.x) / 2 + 22, (hip.y + bike.pedal.y) / 2 - 6)
        return [
          floorLine(),
          ...bike.els,
          ...chain([hip, knee, bike.pedal]),
          ...chain([hip, shoulder, P(190, 100), bike.bars]),
          head(P(170, 58)),
          focus(knee),
          note('saddle height: never straight at the bottom')
        ]
      }
    },

    'bike-intervals': {
      label: ['Easy spin', '20 seconds HARD, then easy again'],
      custom: true,
      a: { crank: 0, effort: 0 },
      b: { crank: 200, effort: 1 },
      draw: (p) => {
        const bike = bikeProp(p.crank)
        const hip = P(128, 118)
        const shoulder = P(mix(158, 162, p.effort), mix(74, 80, p.effort))
        const knee = P((hip.x + bike.pedal.x) / 2 + 22, (hip.y + bike.pedal.y) / 2 - 6)
        const els = [
          floorLine(),
          ...bike.els,
          ...chain([hip, knee, bike.pedal]),
          ...chain([hip, shoulder, P(190, 104), bike.bars]),
          head(P(shoulder.x + 12, shoulder.y - 16)),
          focus(knee)
        ]
        // Speed marks appear as the effort ramps up.
        for (let i = 0; i < 3; i++) {
          els.push({
            t: 'line',
            a: P(30 + i * 12, 150 + i * 14),
            b: P(30 + i * 12 + 22 * p.effort, 150 + i * 14),
            cls: 'fig-guide'
          })
        }
        els.push(note('knees track straight ahead even when hard'))
        return els
      }
    },

    'bike-outdoor-loop': {
      label: ['Easy gear, high cadence', 'Slight bend at the bottom of every stroke'],
      custom: true,
      a: { crank: 20 },
      b: { crank: 200 },
      draw: (p) => {
        const bike = bikeProp(p.crank)
        const hip = P(128, 118)
        const shoulder = P(158, 74)
        const knee = P((hip.x + bike.pedal.x) / 2 + 22, (hip.y + bike.pedal.y) / 2 - 6)
        return [
          floorLine(),
          // A horizon and a hill, to distinguish this from the trainer.
          { t: 'path', d: 'M 8 150 Q 60 128 108 148', cls: 'fig-ground' },
          { t: 'path', d: 'M 200 146 Q 250 120 292 144', cls: 'fig-ground' },
          ...bike.els,
          ...chain([hip, knee, bike.pedal]),
          ...chain([hip, shoulder, P(190, 100), bike.bars]),
          head(P(170, 58)),
          focus(knee),
          note('stay seated if standing loads the knee')
        ]
      }
    },

    'march-in-place-cardio': variantOf('marching', [
      'Stand tall, feet straight ahead',
      'Knee to hip height, land on a soft knee'
    ]),

    'stair-climb': {
      label: ['Whole foot on each step', 'Drive up through the heel'],
      custom: true,
      a: { u: 0 },
      b: { u: 1 },
      draw: (p) => {
        const hip = P(mix(120, 156, p.u), mix(138, 112, p.u))
        const shoulder = P(hip.x - 4, hip.y - 56)
        return [
          floorLine(),
          stairsProp(72, 4, 26, 42),
          ...chain([hip, P(mix(150, 186, p.u), mix(160, 136, p.u)), P(mix(160, 196, p.u), mix(188, 162, p.u))]),
          ...chain([hip, P(mix(104, 140, p.u), mix(178, 152, p.u)), P(mix(98, 134, p.u), mix(GROUND, 188, p.u))], 'fig-far'),
          ...chain([hip, shoulder]),
          ...chain([shoulder, P(shoulder.x + 18, shoulder.y + 24), P(shoulder.x + 10, shoulder.y + 48)]),
          head(P(shoulder.x + 2, shoulder.y - 22)),
          note('coming down matters — land softly')
        ]
      }
    },

    'step-up-cardio': {
      label: ['Step up, whole foot on the step', 'Step down softly, then alternate'],
      custom: true,
      a: { u: 0 },
      b: { u: 1 },
      draw: (p) => {
        const stepTop = GROUND - 30
        const hip = P(mix(126, 188, p.u), mix(128, 100, p.u))
        const shoulder = P(hip.x - 2, hip.y - 56)
        return [
          floorLine(),
          stepRight(168, 30),
          ...chain([hip, P(mix(118, 208, p.u), mix(168, 150, p.u)), P(mix(112, 214, p.u), mix(GROUND, stepTop, p.u))], 'fig-far'),
          ...chain([hip, P(mix(162, 192, p.u), mix(158, 146, p.u)), P(192, stepTop)]),
          ...chain([hip, shoulder]),
          ...chain([shoulder, P(shoulder.x + 14, shoulder.y + 26), P(shoulder.x + 6, shoulder.y + 50)]),
          head(P(shoulder.x - 2, shoulder.y - 22)),
          note('rhythmic and soft beats fast')
        ]
      }
    },

    'jumping-jacks': {
      label: ['Feet together, arms down', 'Arms overhead, feet out — land SOFT'],
      custom: true,
      a: { u: 0 },
      b: { u: 1 },
      draw: (p) => {
        const shY = 92
        const els = [
          front(),
          { t: 'line', a: P(124, shY), b: P(176, shY), cls: 'fig-limb' },
          { t: 'line', a: P(150, shY), b: P(150, 150), cls: 'fig-limb' },
          { t: 'line', a: P(133, 150), b: P(167, 150), cls: 'fig-limb' },
          head(P(150, 60))
        ]
        for (const s of [-1, 1]) {
          els.push(...chain([
            P(150 + s * 26, shY),
            P(150 + s * mix(31, 40, p.u), mix(120, 68, p.u)),
            P(150 + s * mix(34, 30, p.u), mix(148, 34, p.u))
          ]))
          // Knees stay bent on the wide (landing) shape.
          els.push(...chain([
            P(150 + s * 17, 150),
            P(150 + s * mix(19, 40, p.u), mix(182, 178, p.u)),
            P(150 + s * mix(21, 62, p.u), GROUND)
          ]))
        }
        els.push(note('never land on a straight leg'))
        return els
      }
    },

    // =====================================================================
    // YOGA
    // =====================================================================
    'sun-salutation': {
      label: ['Reach up', 'Fold — knees BENT', 'Step back to a plank', 'Hips up and back'],
      custom: true,
      a: { u: 0 },
      b: { u: 1 },
      draw: (p) => {
        // [toe, ankle, knee, hip, shoulder, headC, elbow, hand]
        const frames = [
          [P(168, GROUND), P(150, 206), P(150, 166), P(150, 118), P(150, 62), P(150, 40), P(154, 34), P(158, 14)],
          [P(170, GROUND), P(152, 206), P(160, 166), P(150, 120), P(160, 170), P(162, 192), P(168, 196), P(174, GROUND)],
          [P(244, GROUND), P(232, 198), P(200, 176), P(150, 150), P(96, 160), P(80, 152), P(92, 190), P(88, GROUND)],
          [P(236, GROUND), P(218, 196), P(206, 150), P(178, 96), P(112, 150), P(96, 166), P(100, 184), P(86, GROUND)]
        ]
        const [toe, ankle, knee, hip, shoulder, headC, elbow, hand] = keyframe(frames, p.u)
        return [
          floorLine(),
          ...chain([hip, knee, ankle, toe]),
          ...chain([hip, shoulder]),
          ...chain([shoulder, elbow, hand]),
          head(headC),
          note('knees stay bent in the fold')
        ]
      }
    },

    'low-lunge': {
      label: ['Back knee down, front knee over the ankle', 'Tuck the tail, lift the chest'],
      a: {
        torso: 8,
        near: { thigh: -70, shin: -170, foot: -34 },
        far: { thigh: 44, shin: -6, foot: 0 },
        arm: { upper: 24, fore: 34 }, dx: 6
      },
      b: {
        torso: -6,
        near: { thigh: -84, shin: -178, foot: -34 },
        far: { thigh: 34, shin: -14, foot: 0 },
        arm: { upper: 168, fore: 176 }, dx: 6
      },
      focusJoint: 'hip',
      extra: () => [floorLine(), note('front knee stacks over the ankle, not past it')]
    },

    'warrior-three': {
      label: ['Stand on one SOFT knee', 'Hinge — torso and back leg parallel to the floor'],
      a: { torso: 26, near: { thigh: 9, shin: -13, foot: 0 }, far: { thigh: -30, shin: -14, foot: -10 }, arm: { upper: 30, fore: 40 }, contacts: ['toe', 'heel'] },
      b: { torso: 84, near: { thigh: 11, shin: -15, foot: 0 }, far: { thigh: -86, shin: -94, foot: -12 }, arm: { upper: 130, fore: 150 }, contacts: ['toe', 'heel'], dx: -14 },
      focusJoint: 'knee',
      extra: (j) => [
        floorLine(),
        guide(j.shoulder, j.farAnkle),
        note('hips stay level, not rolled open')
      ]
    },

    'legs-up-wall': {
      label: ['Hips close to the wall', 'Legs rest with a SOFT bend'],
      custom: true,
      a: { u: 0 },
      b: { u: 1 },
      draw: (p) => {
        const shoulder = P(96, 200)
        const hip = P(196, 200)
        const knee = P(mix(212, 218, p.u), mix(152, 146, p.u))
        const ankle = P(mix(216, 226, p.u), mix(104, 92, p.u))
        return [
          floorLine(),
          wallAt(236),
          ...chain([shoulder, hip, knee, ankle]),
          ...chain([shoulder, P(70, 206)]),
          head(P(78, 196)),
          focus(knee),
          note('keep the knees softly bent')
        ]
      }
    },

    'supine-twist': {
      label: ['Knee drawn up to the chest', 'Guide it across — both shoulders stay down'],
      custom: true,
      a: { u: 0 },
      b: { u: 1 },
      draw: (p) => {
        const shL = P(112, 74)
        const shR = P(188, 74)
        const hip = P(150, 132)
        const knee = P(mix(150, 96, p.u), mix(96, 140, p.u))
        const ankle = P(mix(168, 104, p.u), mix(126, 176, p.u))
        return [
          above(),
          { t: 'line', a: shL, b: shR, cls: 'fig-limb' },
          { t: 'line', a: P(150, 74), b: hip, cls: 'fig-limb' },
          ...chain([shL, P(80, 96)]),
          ...chain([shR, P(220, 96)]),
          ...chain([hip, knee, ankle]),
          ...chain([hip, P(160, 180), P(166, 214)], 'fig-far'),
          head(P(150, 44)),
          focus(shL),
          note('both shoulders stay on the floor')
        ]
      }
    },

    'reclined-butterfly': {
      label: ['Soles together, knees falling open', 'Let gravity do all of it'],
      custom: true,
      a: { u: 0 },
      b: { u: 1 },
      draw: (p) => {
        const hip = P(150, 108)
        const feet = P(150, 196)
        const els = [
          above(),
          { t: 'line', a: P(124, 74), b: P(176, 74), cls: 'fig-limb' },
          { t: 'line', a: P(150, 74), b: hip, cls: 'fig-limb' },
          ...chain([P(124, 74), P(96, 92)]),
          ...chain([P(176, 74), P(204, 92)]),
          head(P(150, 46))
        ]
        for (const s of [-1, 1]) {
          const knee = P(150 + s * mix(44, 74, p.u), mix(152, 142, p.u))
          els.push(...chain([P(150 + s * 15, hip.y), knee, feet]))
        }
        els.push({ t: 'line', a: P(138, feet.y), b: P(162, feet.y), cls: 'fig-limb' })
        els.push(note('cushions under the knees if needed'))
        return els
      }
    }
  })
})()
