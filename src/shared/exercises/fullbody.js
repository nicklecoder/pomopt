'use strict'

const PACK = 'fullbody'

module.exports = [
  {
    id: 'fb-squat-hold',
    name: 'Squat Hold',
    pack: PACK,
    groups: ['legs'],
    equipment: [],
    setting: 'desk',
    position: 'standing',
    intensity: 'moderate',
    perSide: false,
    seconds: 45,
    dose: 'Hold 45s',
    why: 'An isometric hold builds strength in the exact position without pounding the knees, and it is dead simple to do anywhere.',
    cues: [
      'Feet about shoulder-width, sit your hips back and down until the thighs are working, chest tall.',
      'Keep the weight in your heels and the knees tracking over your toes, not caving in.',
      'Hold here and breathe — thighs and glutes doing the work, not your lower back.',
      'Ease out and shake the legs loose when the time is up.'
    ]
  },
  {
    id: 'fb-lunge-hold',
    name: 'Lunge Hold',
    pack: PACK,
    groups: ['legs'],
    equipment: [],
    setting: 'desk',
    position: 'standing',
    intensity: 'moderate',
    perSide: true,
    seconds: 60,
    dose: 'Hold 30s each side',
    why: 'A held split stance loads each leg on its own and trains the balance and control the rep version rushes past.',
    cues: [
      'Step one foot back into a split stance, feet about hip-width apart for balance.',
      'Sink straight down until both knees are near 90 degrees, front shin vertical, torso tall.',
      'Hold with the weight in the front heel, front knee soft — not shoved past the toes.',
      'Switch legs at the halfway mark.'
    ]
  },
  {
    id: 'fb-pushup',
    name: 'Push-Up',
    pack: PACK,
    groups: ['push'],
    equipment: ['floor'],
    setting: 'space',
    position: 'floor',
    intensity: 'moderate',
    perSide: false,
    seconds: 45,
    dose: '10-15 reps',
    why: 'The whole upper body and the core in one move. Scales from the knees up to full without any gear.',
    cues: [
      'Hands under the shoulders, body in one straight line from head to heels.',
      'Lower the chest toward the floor, elbows tracking back at about 45 degrees.',
      'Push back up to straight arms, keeping the hips level the whole time.',
      'Too hard? Drop to your knees or push up from a desk instead — same line, less load.'
    ]
  },
  {
    id: 'fb-pullup',
    name: 'Pull-Up / Dead Hang',
    pack: PACK,
    groups: ['pull'],
    equipment: ['pullupBar'],
    setting: 'space',
    position: 'standing',
    intensity: 'moderate',
    perSide: false,
    seconds: 45,
    dose: '5-10 reps, or a 30s dead hang',
    why: 'The best pulling movement there is, and it scales all the way down — even just hanging builds grip and shoulder health.',
    cues: [
      'Hang from the bar, arms nearly straight, shoulders pulled down away from your ears.',
      'Brace your stomach so you do not swing.',
      'Pull your chest toward the bar, elbows driving down and back, then lower over 3 seconds.',
      'Cannot do full reps? Just hold the hang, or jump to the top and lower as slowly as you can.'
    ]
  },
  {
    id: 'fb-plank',
    name: 'Front Plank',
    pack: PACK,
    groups: ['core'],
    equipment: ['floor'],
    setting: 'space',
    position: 'floor',
    intensity: 'low',
    perSide: false,
    seconds: 45,
    dose: 'Hold 45s',
    why: 'Teaches the core to hold the spine still under load, which is what it actually does all day.',
    cues: [
      'Forearms on the floor under your shoulders, feet back, body in one straight line.',
      'Squeeze the glutes and brace the belly so the hips do not sag or pike up.',
      'Keep the neck long — look at the floor just ahead of your hands.',
      'Breathe steadily and hold the line for the full time.'
    ]
  },
  {
    id: 'fb-bird-dog',
    name: 'Bird Dog',
    pack: PACK,
    groups: ['core'],
    equipment: ['floor'],
    setting: 'space',
    position: 'floor',
    intensity: 'low',
    perSide: false,
    seconds: 45,
    dose: '8 reps per side, slow',
    why: 'Trains the core to resist twisting while the arms and legs move — spinal stability that carries into everything.',
    cues: [
      'On all fours, hands under shoulders and knees under hips, back flat like a tabletop.',
      'Reach the opposite arm and leg out long until they are level with your body.',
      'Keep the hips square to the floor — no rotating, no arching the lower back.',
      'Return under control and alternate sides each rep.'
    ]
  },
  {
    id: 'fb-cat-cow',
    name: 'Cat-Cow',
    pack: PACK,
    groups: ['mobility'],
    equipment: ['floor'],
    setting: 'space',
    position: 'floor',
    intensity: 'low',
    perSide: false,
    seconds: 45,
    dose: '10 slow rounds',
    why: 'Gentle end-to-end movement for a spine that has been stuck in a chair all day.',
    cues: [
      'On all fours, hands under shoulders and knees under hips.',
      'Exhale and round the spine toward the ceiling, tucking the chin — that is cat.',
      'Inhale and drop the belly, lifting the chest and tailbone — that is cow.',
      'Move slowly with your breath, about one round per breath.'
    ]
  },
  {
    id: 'fb-childs-pose',
    name: "Child's Pose",
    pack: PACK,
    groups: ['mobility'],
    equipment: ['floor'],
    setting: 'space',
    position: 'floor',
    intensity: 'low',
    perSide: false,
    seconds: 45,
    dose: 'Hold 45s',
    why: 'A quiet reset for the hips, lower back and shoulders, and a good way to end a break calm rather than wired.',
    cues: [
      'From all fours, sit your hips back toward your heels and reach the arms out long.',
      'Let your forehead rest down and your chest sink toward the floor.',
      'Breathe into your back and let the hips and lower back release.',
      'Hold and relax for the full time.'
    ]
  }
]
