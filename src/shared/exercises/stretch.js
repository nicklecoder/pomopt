'use strict'

/**
 * Stretching pack — undoing a day at the desk.
 *
 * Most of these need nothing but a chair or a wall, so this pack stays fully
 * useful on an Office profile.
 *
 * Note the absence of aggressive hamstring stretching: in a knee that already
 * hyperextends, chasing more posterior length is the wrong direction. The
 * hamstring entries here are gentle and paired with a soft-knee cue.
 */

const PACK = 'stretch'

module.exports = [
  // ----------------------------------------------------------------- hips
  {
    id: 'seated-figure-four-stretch',
    name: 'Seated Figure-4',
    pack: PACK,
    groups: ['hips'],
    equipment: ['chair'],
    setting: 'desk',
    position: 'seated',
    intensity: 'low',
    perSide: true,
    seconds: 45,
    dose: 'Hold 45s per side',
    why: 'Opens the deep glute and the muscles that hold your leg turned out — the ones that sitting shortens all day.',
    cues: [
      'Sit tall, one ankle resting across the opposite knee.',
      'Let the crossed knee fall open toward the floor. Do not force it down.',
      'Keep your back flat and hinge forward from the hips.',
      'Breathe out as you sink a little deeper.',
      'You should feel it deep in the backside, not in the knee.'
    ],
    caution: 'Any pinching on the inside of the crossed knee means you are levering the joint. Back off.'
  },
  {
    id: 'standing-quad-stretch',
    name: 'Standing Quad Stretch',
    pack: PACK,
    groups: ['hips'],
    equipment: ['desk'],
    setting: 'desk',
    position: 'standing',
    intensity: 'low',
    perSide: true,
    seconds: 40,
    dose: 'Hold 40s per side',
    why: 'The quad crosses both the hip and the knee, so a tight one pulls on the kneecap all day while you stand.',
    cues: [
      'Hold the desk with one hand. Stand tall, standing knee SOFT.',
      'Bend the other knee and catch the ankle behind you.',
      'Tuck your tailbone under and squeeze that glute — this is what makes it work.',
      'Keep the knees close together, not splayed out to the side.',
      'Stand up tall. Do not lean forward to reach further.'
    ],
    caution: 'Pull on the ankle, never the foot, and stop if you feel it in the front of the knee.'
  },
  {
    id: 'couch-stretch',
    name: 'Deep Hip Flexor Stretch',
    pack: PACK,
    groups: ['hips'],
    equipment: ['floor', 'mat', 'wall'],
    setting: 'space',
    position: 'floor',
    intensity: 'moderate',
    perSide: true,
    seconds: 50,
    dose: 'Hold 50s per side',
    why: 'The strongest available stretch for hip flexors shortened by sitting, which is what tips your pelvis and drives that turned-out stance.',
    cues: [
      'Kneel with your back shin flat against a wall, foot pointing up it.',
      'Other foot planted flat in front, knee over the ankle.',
      'Squeeze the glute of the kneeling leg and tuck your tailbone HARD.',
      'Bring your torso upright only as far as you can hold the tuck.',
      'Breathe slowly. This one is intense — back off if you cannot breathe evenly.'
    ]
  },

  // ----------------------------------------------------------- hamstrings
  {
    id: 'gentle-hamstring-stretch',
    name: 'Gentle Hamstring Stretch',
    pack: PACK,
    groups: ['hamstrings'],
    equipment: ['chair'],
    setting: 'desk',
    position: 'standing',
    intensity: 'low',
    perSide: true,
    seconds: 40,
    dose: 'Hold 40s per side',
    why: 'Enough length to relieve the pull on your pelvis, without chasing the extra range that would let your knee hyperextend further.',
    cues: [
      'Place one heel on a chair seat, leg out in front. Keep a SOFT bend in that knee.',
      'Standing leg also soft.',
      'Hinge forward from the hips with a flat back until you feel a mild stretch.',
      'Mild is the target. This is not a competition for range.',
      'Keep the raised foot pointing straight up, not turned out.'
    ],
    caution: 'Never straighten the raised leg fully. A locked knee under stretch is what created the problem.'
  },
  {
    id: 'standing-calf-stretch-stretch',
    name: 'Wall Calf Stretch',
    pack: PACK,
    groups: ['hamstrings'],
    equipment: ['wall'],
    setting: 'desk',
    position: 'standing',
    intensity: 'low',
    perSide: true,
    seconds: 40,
    dose: 'Hold 40s per side',
    why: 'Tight calves limit the ankle, and a limited ankle is one of the main reasons a foot turns outward when you walk.',
    cues: [
      'Hands on the wall, one foot well back, that leg straight.',
      'Back heel pressed flat, foot pointing straight at the wall.',
      'Lean your hips toward the wall until the upper calf pulls.',
      'Hold steadily. Do not bounce.',
      'Repeat with the back knee slightly bent to catch the soleus underneath.'
    ]
  },

  // ------------------------------------------------------- chestShoulders
  {
    id: 'doorway-chest-stretch',
    name: 'Doorway Chest Stretch',
    pack: PACK,
    groups: ['chestShoulders'],
    equipment: ['wall'],
    setting: 'desk',
    position: 'standing',
    intensity: 'low',
    perSide: false,
    seconds: 45,
    dose: 'Hold 45s',
    why: 'Directly reverses the rounded-forward shoulder position that hours of typing bakes in.',
    cues: [
      'Stand in a doorway. Forearms flat on the frame, elbows at about shoulder height.',
      'Step one foot through and let your chest travel forward.',
      'Keep your ribs down — do not arch your lower back to get more.',
      'You should feel it across the front of the chest and shoulders.',
      'Breathe slowly and let it release rather than forcing it.'
    ]
  },
  {
    id: 'cross-body-shoulder',
    name: 'Cross-Body Shoulder Stretch',
    pack: PACK,
    groups: ['chestShoulders'],
    equipment: [],
    setting: 'desk',
    position: 'standing',
    intensity: 'low',
    perSide: true,
    seconds: 35,
    dose: 'Hold 35s per side',
    why: 'Releases the back of the shoulder, which gets tight from the small, constant reach out to a mouse.',
    cues: [
      'Bring one arm straight across your chest at shoulder height.',
      'Hook the other forearm underneath it and draw it in toward you.',
      'Pull on the upper arm, not on the elbow joint.',
      'Keep the shoulder pulled DOWN, away from your ear.',
      'Stand tall with soft knees.'
    ]
  },
  {
    id: 'thread-the-needle',
    name: 'Thread the Needle',
    pack: PACK,
    groups: ['chestShoulders', 'spine'],
    equipment: ['floor', 'mat'],
    setting: 'space',
    position: 'floor',
    intensity: 'low',
    perSide: true,
    seconds: 45,
    dose: 'Hold 45s per side',
    why: 'Rotates the upper back and stretches between the shoulder blades in one move — the exact spot that aches after a long session.',
    cues: [
      'Start on hands and knees, hands under shoulders.',
      'Slide one arm underneath your body, palm up, reaching out to the far side.',
      'Let that shoulder and the side of your head rest on the floor.',
      'Keep your hips stacked over your knees — do not let them drift.',
      'Breathe into the space between your shoulder blades.'
    ]
  },

  // ---------------------------------------------------------------- spine
  {
    id: 'cat-cow',
    name: 'Cat-Cow',
    pack: PACK,
    groups: ['spine'],
    equipment: ['floor', 'mat'],
    setting: 'space',
    position: 'floor',
    intensity: 'low',
    perSide: false,
    seconds: 45,
    dose: '10 slow cycles',
    why: 'Moves every segment of the spine through its full range, which is the opposite of holding one fixed posture for an hour.',
    cues: [
      'Hands and knees, hands under shoulders, knees under hips.',
      'Inhale: drop your belly, lift your chest and tailbone.',
      'Exhale: round your back up, tuck the tailbone, drop your head.',
      'Move one vertebra at a time rather than flopping between the two ends.',
      'Match the pace to your breathing.'
    ]
  },
  {
    id: 'seated-spinal-twist',
    name: 'Seated Spinal Twist',
    pack: PACK,
    groups: ['spine'],
    equipment: ['chair'],
    setting: 'desk',
    position: 'seated',
    intensity: 'low',
    perSide: true,
    seconds: 35,
    dose: 'Hold 35s per side',
    why: 'Rotation is the range a desk chair never asks for, so it is the first thing to go stiff.',
    cues: [
      'Sit tall, feet flat on the floor.',
      'Grow taller through the top of your head FIRST, then rotate.',
      'Use the chair back or your thigh for a gentle assist.',
      'Turn from the middle of your back, not by cranking your neck around.',
      'Keep both sitting bones on the seat — do not let one hip lift.'
    ]
  },
  {
    id: 'childs-pose',
    name: "Child's Pose",
    pack: PACK,
    groups: ['spine', 'hips'],
    equipment: ['floor', 'mat'],
    setting: 'space',
    position: 'floor',
    intensity: 'low',
    perSide: false,
    seconds: 50,
    dose: 'Hold 50s',
    why: 'Lengthens the lower back and lets the hips settle, and it is a genuine mental reset partway through a long block of work.',
    cues: [
      'Kneel, big toes together, knees wide apart.',
      'Sit your hips back toward your heels.',
      'Walk your hands forward and let your forehead rest on the floor.',
      'Let your shoulders relax and your back round naturally.',
      'Breathe into your lower back. Stay for the whole hold.'
    ],
    caution: 'Put a cushion under your hips or between your calves if your knees complain.'
  },

  // ----------------------------------------------------------------- neck
  {
    id: 'neck-side-stretch',
    name: 'Neck Side Stretch',
    pack: PACK,
    groups: ['neck'],
    equipment: [],
    setting: 'desk',
    position: 'seated',
    intensity: 'low',
    perSide: true,
    seconds: 35,
    dose: 'Hold 35s per side',
    why: 'The upper trapezius holds tension for hours while you concentrate, and you generally do not notice until it aches.',
    cues: [
      'Sit or stand tall. Let one arm hang heavy, or hold the edge of the seat.',
      'Tilt your ear toward the opposite shoulder.',
      'Rest that hand lightly on your head — use its weight only, do not pull.',
      'Keep the shoulder of the stretched side pressed DOWN.',
      'Breathe out and let it lengthen.'
    ],
    caution: 'Never pull hard on your own head. Gravity is enough.'
  },
  {
    id: 'chin-tuck',
    name: 'Chin Tuck',
    pack: PACK,
    groups: ['neck'],
    equipment: [],
    setting: 'desk',
    position: 'seated',
    intensity: 'low',
    perSide: false,
    seconds: 35,
    dose: '10 reps, 5s hold',
    why: 'Strengthens the deep neck flexors that stop your head drifting forward toward the monitor.',
    cues: [
      'Sit tall, eyes level and facing straight ahead.',
      'Draw your chin straight back, as if making a double chin.',
      'Your head slides backward — it does not nod down.',
      'Hold 5 seconds. You should feel a stretch at the base of the skull.',
      'Release slowly and repeat.'
    ]
  },
  {
    id: 'wrist-forearm-stretch',
    name: 'Wrist & Forearm Stretch',
    pack: PACK,
    groups: ['neck'],
    equipment: [],
    setting: 'desk',
    position: 'seated',
    intensity: 'low',
    perSide: true,
    // Grouped with neck work, but the sides are arms.
    sideNoun: 'arm',
    seconds: 35,
    dose: 'Hold 35s per side',
    why: 'Typing keeps the forearms contracted for hours. This is the cheapest insurance there is against wrist trouble.',
    cues: [
      'Extend one arm straight out, palm facing away like signalling stop.',
      'Use the other hand to gently draw the fingers back toward you.',
      'Hold, breathing normally. You should feel the underside of the forearm.',
      'Then flip: point the fingers down, palm toward you, and draw the hand back.',
      'Keep the elbow straight but not locked hard.'
    ]
  }
]
