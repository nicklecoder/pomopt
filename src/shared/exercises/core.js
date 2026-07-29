'use strict'

/**
 * Core pack.
 *
 * Weighted toward anti-movement work (resisting extension and rotation) rather
 * than crunches, because that is what actually holds a desk-worker's spine up.
 * The ab roller gets its own progression since you own one.
 */

const PACK = 'core'

module.exports = [
  // -------------------------------------------------------- anti-extension
  {
    id: 'plank',
    name: 'Front Plank',
    pack: PACK,
    groups: ['antiExtension'],
    equipment: ['floor'],
    setting: 'space',
    position: 'floor',
    intensity: 'low',
    perSide: false,
    seconds: 45,
    dose: 'Hold 45s',
    why: 'Teaches the trunk to stay rigid, which is what stops your lower back taking the load when you stand for hours.',
    cues: [
      'Forearms on the floor, elbows under your shoulders, feet hip-width.',
      'Body in one straight line from head to heels.',
      'Tuck your tailbone slightly so your lower back flattens — no sagging.',
      'Squeeze glutes and quads hard. Brace the stomach as if about to be poked.',
      'Breathe normally throughout. If your hips drop, stop the set.'
    ]
  },
  {
    id: 'dead-bug',
    name: 'Dead Bug',
    pack: PACK,
    groups: ['antiExtension'],
    equipment: ['floor'],
    setting: 'space',
    position: 'floor',
    intensity: 'low',
    perSide: false,
    seconds: 50,
    dose: '10 reps per side, slow',
    why: 'The safest way to train the deep core, and it teaches you to keep your ribs down — the same rib position that stops your pelvis tipping forward when you stand.',
    cues: [
      'Lie on your back, arms straight up, knees over hips bent 90 degrees.',
      'Press your lower back flat into the floor and keep it there. This is the whole exercise.',
      'Slowly lower the opposite arm and leg toward the floor.',
      'Stop before your back lifts off the floor, then return.',
      'Move slowly and keep breathing. Alternate sides.'
    ],
    caution: 'The moment your lower back arches off the floor you have gone too far. Shorten the range.'
  },
  {
    id: 'ab-rollout-knees',
    name: 'Ab Roller — From Knees',
    pack: PACK,
    groups: ['antiExtension'],
    equipment: ['abRoller', 'floor', 'mat'],
    setting: 'space',
    position: 'floor',
    intensity: 'moderate',
    perSide: false,
    seconds: 50,
    dose: '8 reps, slow',
    why: 'The strongest anti-extension exercise most people can do at home. It is also unforgiving of a sloppy lower back, which makes it a good honesty check.',
    cues: [
      'Kneel on the mat, roller under your shoulders, arms straight.',
      'Tuck your tailbone and brace hard BEFORE you move.',
      'Roll forward only as far as you can go while keeping your lower back flat.',
      'That distance is likely much shorter than you expect. Respect it.',
      'Pull back using your stomach, not your arms.'
    ],
    caution: 'Any lower-back pinching means you rolled too far. Reduce the range immediately.'
  },
  {
    id: 'hollow-hold',
    name: 'Hollow Body Hold',
    pack: PACK,
    groups: ['antiExtension', 'flexion'],
    equipment: ['floor'],
    setting: 'space',
    position: 'floor',
    intensity: 'moderate',
    perSide: false,
    seconds: 35,
    dose: 'Hold 35s',
    why: 'Builds a braced trunk under a long lever, which transfers to everything else you lift.',
    cues: [
      'Lie on your back, press your lower back firmly into the floor.',
      'Lift your shoulder blades and legs a few inches off the floor.',
      'Arms can be by your sides (easier) or overhead (harder).',
      'Keep the lower back glued down — that contact is non-negotiable.',
      'If your back lifts, bend your knees or bring your arms down.'
    ]
  },

  // ---------------------------------------------------------------- flexion
  {
    id: 'seated-knee-tuck',
    name: 'Seated Knee Tuck',
    pack: PACK,
    groups: ['flexion'],
    equipment: ['chair'],
    setting: 'desk',
    position: 'seated',
    intensity: 'low',
    perSide: false,
    seconds: 40,
    dose: '12 reps',
    why: 'Core work you can do in a desk chair without anyone noticing, which makes it the one that actually gets done at the office.',
    cues: [
      'Sit toward the front edge of the chair, hands gripping the sides.',
      'Lean back slightly and lift both feet off the floor.',
      'Brace your stomach, then draw both knees toward your chest.',
      'Extend the legs back out without letting the feet touch the floor.',
      'Keep the movement slow — do not rock.'
    ]
  },
  {
    id: 'reverse-crunch',
    name: 'Reverse Crunch',
    pack: PACK,
    groups: ['flexion'],
    equipment: ['floor'],
    setting: 'space',
    position: 'floor',
    intensity: 'low',
    perSide: false,
    seconds: 45,
    dose: '12 reps, slow',
    why: 'Works the lower abs by moving the pelvis rather than the ribs, which spares your neck entirely.',
    cues: [
      'Lie on your back, arms flat at your sides, knees bent over your hips.',
      'Curl your pelvis up off the floor, bringing your knees toward your chest.',
      'The movement is small — it is a curl of the tailbone, not a leg swing.',
      'Lower over 3 seconds under full control.',
      'Do not use momentum. If you are swinging, slow down.'
    ]
  },

  // --------------------------------------------------------------- rotation
  {
    id: 'pallof-press',
    name: 'Pallof Press (band)',
    pack: PACK,
    groups: ['rotation'],
    equipment: ['band'],
    setting: 'desk',
    position: 'standing',
    intensity: 'low',
    perSide: true,
    seconds: 40,
    dose: '10 reps per side',
    why: 'Anti-rotation: your core works hardest by refusing to move. Best carryover to real life of any core exercise.',
    cues: [
      'Anchor a band at chest height. Stand side-on to it and step away until it is taut.',
      'Hold the band at your chest with both hands, knees soft.',
      'Press your hands straight out in front of you.',
      'The band will try to twist you toward the anchor. Do not let it.',
      'Hold for 2 seconds at full extension, then bring it back in.'
    ]
  },
  {
    id: 'side-plank',
    name: 'Side Plank',
    pack: PACK,
    groups: ['rotation', 'antiExtension'],
    equipment: ['floor'],
    setting: 'space',
    position: 'floor',
    intensity: 'moderate',
    perSide: true,
    seconds: 35,
    dose: 'Hold 35s per side',
    why: 'Trains the obliques and the side of the hip together — and hip stability is directly relevant to how your knee tracks.',
    cues: [
      'Lie on your side, elbow under your shoulder, legs stacked.',
      'Lift your hips so your body makes one straight line.',
      'Push the bottom shoulder away from your ear — do not sag into it.',
      'Squeeze the underneath glute hard.',
      'Drop to the bottom knee for an easier version if the hips start dropping.'
    ]
  },
  {
    id: 'db-suitcase-carry',
    name: 'Suitcase Carry',
    pack: PACK,
    groups: ['rotation'],
    equipment: ['dumbbells'],
    minWeightLb: 25,
    setting: 'space',
    position: 'standing',
    intensity: 'moderate',
    perSide: true,
    seconds: 40,
    dose: 'Walk 40s per side',
    why: 'One heavy weight on one side forces the whole trunk to resist collapsing sideways — and you get to practise walking with your toes forward while you do it.',
    cues: [
      'Pick up one heavy dumbbell in one hand. Nothing in the other.',
      'Stand tall, shoulders level. Do not lean away from the weight.',
      'Walk slowly and deliberately, knees soft.',
      'Check your feet: still pointing straight ahead?',
      'Keep your ribs down and your shoulder pulled back on the loaded side.'
    ]
  },

  // ---------------------------------------------------------------- lowBack
  {
    id: 'bird-dog',
    name: 'Bird Dog',
    pack: PACK,
    groups: ['lowBack', 'antiExtension'],
    equipment: ['floor'],
    setting: 'space',
    position: 'floor',
    intensity: 'low',
    perSide: false,
    seconds: 50,
    dose: '8 reps per side, 3s hold',
    why: 'Trains the spinal stabilisers and glutes together with almost no spinal load — the standard low-back rehab exercise for good reason.',
    cues: [
      'On hands and knees, hands under shoulders, knees under hips.',
      'Flatten your back — imagine balancing a mug on it.',
      'Extend the opposite arm and leg out to horizontal, no higher.',
      'Do not let your hips rotate or your back arch. The mug stays put.',
      'Hold 3 seconds, return under control, switch sides.'
    ]
  },
  {
    id: 'prone-superman',
    name: 'Prone Back Extension',
    pack: PACK,
    groups: ['lowBack'],
    equipment: ['floor'],
    setting: 'space',
    position: 'floor',
    intensity: 'low',
    perSide: false,
    seconds: 40,
    dose: '12 reps, 2s hold',
    why: 'The back extensors spend all day being stretched under load while you lean toward a screen. This is the reverse.',
    cues: [
      'Lie face down, arms by your sides or out in a Y.',
      'Squeeze your glutes first, before anything lifts.',
      'Lift your chest a few inches off the floor. Keep your neck long — look at the floor.',
      'This is a small movement. You are not trying to bend backwards.',
      'Hold 2 seconds, lower slowly.'
    ],
    caution: 'Stop if you feel any pinching in the lower back rather than muscular effort.'
  }
]
