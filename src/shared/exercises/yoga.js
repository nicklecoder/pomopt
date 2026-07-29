'use strict'

/**
 * Yoga pack.
 *
 * The balance poses do double duty as knee proprioception work, so they are all
 * cued with an explicitly soft standing knee. Yoga is the single most common
 * place people lock a hyperextending knee — teachers cue "straighten the leg"
 * and a recurvatum knee obliges by going past straight. Every standing pose
 * here overrides that.
 */

const PACK = 'yoga'

module.exports = [
  // ----------------------------------------------------------------- flow
  {
    id: 'sun-salutation',
    name: 'Sun Salutation',
    pack: PACK,
    groups: ['flow'],
    equipment: ['floor', 'mat'],
    setting: 'space',
    position: 'floor',
    intensity: 'moderate',
    perSide: false,
    seconds: 120,
    dose: '3 rounds, slow',
    why: 'Moves the spine, hips, shoulders and hamstrings through their ranges in one continuous sequence — a lot of mobility per minute.',
    cues: [
      'Stand tall, knees soft. Inhale, reach the arms overhead.',
      'Exhale, hinge and fold forward. Keep the knees BENT — this is not a hamstring test.',
      'Inhale, halfway lift with a flat back. Exhale, step back to a plank.',
      'Lower down, then inhale into a gentle backbend with the shoulders drawn back.',
      'Exhale, hips up and back into downward dog. Step forward and rise. Repeat.'
    ]
  },
  {
    id: 'downward-dog',
    name: 'Downward-Facing Dog',
    pack: PACK,
    groups: ['flow'],
    equipment: ['floor', 'mat'],
    setting: 'space',
    position: 'floor',
    intensity: 'low',
    perSide: false,
    seconds: 50,
    dose: 'Hold 50s, pedal the feet',
    why: 'Lengthens calves, hamstrings and lats simultaneously, and the overhead arm position is a direct antidote to hunching.',
    cues: [
      'From hands and knees, tuck the toes and lift the hips up and back.',
      'Keep the knees BENT — length in the spine matters far more than straight legs.',
      'Press the floor away and rotate the upper arms outward.',
      'Let your head hang between your arms; relax your neck.',
      'Pedal the feet, bending one knee at a time to work the calves.'
    ],
    caution: 'Never push the knees back to straighten them here. Bent knees, long spine.'
  },
  {
    id: 'low-lunge',
    name: 'Low Lunge',
    pack: PACK,
    groups: ['flow', 'restorative'],
    equipment: ['floor', 'mat'],
    setting: 'space',
    position: 'floor',
    intensity: 'low',
    perSide: true,
    seconds: 45,
    dose: 'Hold 45s per side',
    why: 'Opens the hip flexors on the back leg — the muscles most shortened by a day of sitting or standing at a desk.',
    cues: [
      'One foot forward between your hands, back knee resting on the mat.',
      'Front knee stacked over the front ankle, not past it.',
      'Tuck the tailbone under and squeeze the back glute.',
      'Rise up onto your fingertips or lift the chest, arms overhead.',
      'Sink the hips gently forward. Keep the tuck the whole time.'
    ]
  },

  // -------------------------------------------------------------- balance
  {
    id: 'tree-pose',
    name: 'Tree Pose',
    pack: PACK,
    groups: ['balance'],
    equipment: [],
    setting: 'desk',
    position: 'standing',
    intensity: 'low',
    perSide: true,
    seconds: 40,
    dose: 'Hold 40s per side',
    why: 'A balance hold that is also proprioception training for the standing knee — the exact quality your hyperextension rehab needs.',
    cues: [
      'Stand tall. Shift your weight onto one foot, that knee SOFT and slightly bent.',
      'Place the other foot on the ankle, calf, or inner thigh — never on the side of the knee.',
      'Press the foot and leg into each other.',
      'Hands at your chest or overhead. Fix your eyes on one point.',
      'Keep checking that standing knee. If it locks, rebend it.'
    ],
    caution: 'The standing knee must stay unlocked for the entire hold. This is the pose where recurvatum most often gets rehearsed.'
  },
  {
    id: 'warrior-two',
    name: 'Warrior II',
    pack: PACK,
    groups: ['balance'],
    equipment: ['floor', 'mat'],
    setting: 'space',
    position: 'standing',
    intensity: 'moderate',
    perSide: true,
    seconds: 45,
    dose: 'Hold 45s per side',
    why: 'Builds quad and glute endurance in a deeply bent position, which is the opposite of your locked-out standing habit.',
    cues: [
      'Wide stance. Front foot points straight forward, back foot turned in about 45 degrees.',
      'Bend the front knee until it stacks directly over the ankle.',
      'Track the front knee toward the little-toe side — do not let it fall inward.',
      'Keep the BACK leg strong but not locked at the knee.',
      'Arms out at shoulder height, gaze over the front hand.'
    ]
  },
  {
    id: 'warrior-three',
    name: 'Warrior III',
    pack: PACK,
    groups: ['balance'],
    equipment: [],
    setting: 'desk',
    position: 'standing',
    intensity: 'moderate',
    perSide: true,
    seconds: 35,
    dose: 'Hold 35s per side',
    why: 'A single-leg hinge under balance demand — the same pattern as a single-leg deadlift, and outstanding for hip and knee control.',
    cues: [
      'Stand on one leg with that knee SOFT. Use a desk or wall for fingertip support.',
      'Hinge forward at the hip, extending the other leg straight back.',
      'Aim for torso and back leg roughly parallel to the floor.',
      'Keep the hips level — do not let the lifted hip roll open.',
      'Standing knee stays unlocked throughout.'
    ],
    caution: 'Do not lock the standing knee to steady yourself. Come out of the pose instead.'
  },
  {
    id: 'chair-pose',
    name: 'Chair Pose',
    pack: PACK,
    groups: ['balance'],
    equipment: [],
    setting: 'desk',
    position: 'standing',
    intensity: 'moderate',
    perSide: false,
    seconds: 40,
    dose: 'Hold 40s',
    why: 'Loaded quad endurance with the knees bent — essentially a free-standing wall sit, and it needs no equipment at all.',
    cues: [
      'Feet together or hip-width, toes pointing straight ahead.',
      'Sit the hips back and down as though reaching for a chair behind you.',
      'Keep your weight in the heels — you should be able to wiggle your toes.',
      'Reach the arms forward or overhead, ribs down.',
      'Rise up at the end to a tall stance with SOFT knees.'
    ]
  },

  // ---------------------------------------------------------- restorative
  {
    id: 'legs-up-wall',
    name: 'Legs Up the Wall',
    pack: PACK,
    groups: ['restorative'],
    equipment: ['floor', 'mat', 'wall'],
    setting: 'space',
    position: 'floor',
    intensity: 'low',
    perSide: false,
    seconds: 90,
    dose: 'Hold 90s',
    why: 'Drains the fluid that pools in your legs after hours of standing, and settles your nervous system in a way a screen break alone does not.',
    cues: [
      'Sit side-on next to the wall, then swing your legs up it as you lie back.',
      'Shuffle your hips as close to the wall as is comfortable.',
      'Let the legs rest against the wall with a SOFT bend in the knees.',
      'Arms out to the sides, palms up. Let your whole body go heavy.',
      'Breathe slowly, making the exhale longer than the inhale.'
    ],
    caution: 'Do not press the backs of the knees flat into the wall — keep them softly bent.'
  },
  {
    id: 'supine-twist',
    name: 'Supine Spinal Twist',
    pack: PACK,
    groups: ['restorative'],
    equipment: ['floor', 'mat'],
    setting: 'space',
    position: 'floor',
    intensity: 'low',
    perSide: true,
    seconds: 45,
    dose: 'Hold 45s per side',
    why: 'Releases the lower back and the outside of the hip while you do nothing but breathe.',
    cues: [
      'Lie on your back, arms out wide in a T.',
      'Draw one knee up to your chest, then guide it across your body.',
      'Let the knee rest toward the floor. It does not need to touch.',
      'Turn your head the opposite way if that feels good on your neck.',
      'Keep both shoulders on the floor — that is what makes it a twist.'
    ]
  },
  {
    id: 'reclined-butterfly',
    name: 'Reclined Bound Angle',
    pack: PACK,
    groups: ['restorative'],
    equipment: ['floor', 'mat'],
    setting: 'space',
    position: 'floor',
    intensity: 'low',
    perSide: false,
    seconds: 75,
    dose: 'Hold 75s',
    why: 'A passive opener for the inner thigh and hip, with no effort required — a genuine rest that still does something useful.',
    cues: [
      'Lie on your back. Bring the soles of your feet together and let the knees fall open.',
      'Slide the heels closer or further away until it feels sustainable, not intense.',
      'Rest your arms wherever is comfortable.',
      'Put cushions under the knees if they hang uncomfortably.',
      'Stay still and breathe. Let gravity do all of it.'
    ]
  }
]
