'use strict'

/**
 * Upper body strength pack.
 *
 * Deliberately includes several desk-only options (band and desk push-ups) so
 * the pack still produces something useful on an Office profile where no
 * weights exist.
 *
 * Standing exercises are cued for a soft knee, because loading a barbell-less
 * press while standing locked out is exactly the habit we are trying to break.
 */

const PACK = 'upper'

module.exports = [
  // ------------------------------------------------------------------ push
  {
    id: 'desk-pushup',
    name: 'Desk Push-Up',
    pack: PACK,
    groups: ['push'],
    equipment: ['desk'],
    setting: 'desk',
    position: 'standing',
    intensity: 'low',
    perSide: false,
    seconds: 45,
    dose: '12–15 reps',
    why: 'Pushing work you can do in office clothes without breaking a sweat, and it opens the chest after hours of hunching forward.',
    cues: [
      'Hands on the desk edge, slightly wider than your shoulders.',
      'Walk your feet back until your body is one straight line.',
      'Squeeze your glutes so your hips do not sag.',
      'Lower your chest to the desk over 2 seconds, elbows angled back about 45 degrees.',
      'Press away. The further back your feet, the harder it gets.'
    ]
  },
  {
    id: 'pushup',
    name: 'Push-Up',
    pack: PACK,
    groups: ['push'],
    equipment: ['floor'],
    setting: 'space',
    position: 'floor',
    intensity: 'moderate',
    perSide: false,
    seconds: 50,
    dose: '8–15 reps',
    why: 'The whole anterior chain in one movement, and the plank position doubles as core work.',
    cues: [
      'Hands under the shoulders, body in one line from head to heels.',
      'Squeeze glutes and brace the stomach — no sagging hips.',
      'Lower until your chest is a fist off the floor.',
      'Keep your elbows about 45 degrees from your ribs, not flared to 90.',
      'Press up and stop just short of locking the elbows.'
    ]
  },
  {
    id: 'db-floor-press',
    name: 'Dumbbell Floor Press',
    pack: PACK,
    groups: ['push'],
    equipment: ['dumbbells', 'floor'],
    minWeightLb: 15,
    setting: 'space',
    position: 'floor',
    intensity: 'moderate',
    perSide: false,
    seconds: 55,
    dose: '10 reps',
    why: 'The floor stops your elbows travelling too far, which makes it the friendliest heavy press for shoulders that have been rounded forward all day.',
    cues: [
      'Lie on your back, knees bent, feet flat. Dumbbells at chest height.',
      'Press both up until your arms are nearly straight — stop short of locking.',
      'Lower under control until your triceps touch the floor.',
      'Pause for a beat on the floor. Do not bounce off it.',
      'Keep your ribs down; do not arch your lower back to press.'
    ]
  },
  {
    id: 'db-bench-press',
    name: 'Dumbbell Bench Press',
    pack: PACK,
    groups: ['push'],
    equipment: ['dumbbells', 'bench'],
    minWeightLb: 20,
    setting: 'space',
    position: 'bench',
    intensity: 'moderate',
    perSide: false,
    seconds: 55,
    dose: '8–10 reps',
    why: 'Full range pressing. Dumbbells let each side work independently, which evens out the strength difference desk work builds in.',
    cues: [
      'Lie back with the dumbbells at chest level, wrists stacked over elbows.',
      'Plant both feet. Keep your shoulder blades pulled back and down into the bench.',
      'Press up and slightly together. Stop just short of locking the elbows.',
      'Lower over 3 seconds until you feel a stretch across the chest.',
      'Keep the movement smooth — no bouncing at the bottom.'
    ],
    caution: 'Without a spotter, stay a couple of reps short of failure.'
  },
  {
    id: 'db-incline-press',
    name: 'Incline Dumbbell Press',
    pack: PACK,
    groups: ['push', 'shoulders'],
    equipment: ['dumbbells', 'bench', 'benchIncline'],
    minWeightLb: 15,
    setting: 'space',
    position: 'bench',
    intensity: 'moderate',
    perSide: false,
    seconds: 55,
    dose: '8–10 reps',
    why: 'Hits the upper chest and front shoulder, the exact area that goes slack when you sit hunched over a keyboard.',
    cues: [
      'Set the bench to about 30–45 degrees. Steeper turns it into a shoulder press.',
      'Sit back with the dumbbells at upper-chest height.',
      'Press up and slightly together, stopping short of locked elbows.',
      'Lower slowly until you feel the stretch across the collarbone.',
      'Keep your head and lower back in contact with the bench.'
    ]
  },
  {
    id: 'db-flye',
    name: 'Dumbbell Chest Flye',
    pack: PACK,
    groups: ['push'],
    equipment: ['dumbbells', 'bench'],
    minWeightLb: 10,
    setting: 'space',
    position: 'bench',
    intensity: 'moderate',
    perSide: false,
    seconds: 50,
    dose: '12 reps, light',
    why: 'Opens the chest under load. Use noticeably lighter weight than you press with — this is a stretch, not a lift.',
    cues: [
      'Lie back, dumbbells above your chest, palms facing each other.',
      'Keep a soft, fixed bend in the elbows the whole time.',
      'Open your arms wide in an arc until you feel a stretch across the chest.',
      'Stop when your upper arms reach roughly bench level.',
      'Squeeze back together as though hugging a barrel.'
    ],
    caution: 'Go lighter than you think. This position puts the shoulder in a vulnerable spot at the bottom.'
  },

  // ------------------------------------------------------------------ pull
  {
    id: 'band-pull-apart',
    name: 'Band Pull-Apart',
    pack: PACK,
    groups: ['pull', 'shoulders'],
    equipment: ['band'],
    setting: 'desk',
    position: 'standing',
    intensity: 'low',
    perSide: false,
    seconds: 40,
    dose: '15 reps',
    why: 'The single best antidote to a day of typing. Wakes up the mid-back muscles that hold your shoulders back.',
    cues: [
      'Hold the band at shoulder height, arms straight out in front, hands shoulder-width.',
      'Knees soft, ribs down.',
      'Pull the band apart by driving your hands out and back.',
      'Squeeze your shoulder blades together at the end. Do not shrug.',
      'Return slowly under tension.'
    ]
  },
  {
    id: 'db-row-single',
    name: 'Single-Arm Dumbbell Row',
    pack: PACK,
    groups: ['pull'],
    equipment: ['dumbbells', 'bench'],
    minWeightLb: 15,
    setting: 'space',
    position: 'standing',
    intensity: 'moderate',
    perSide: true,
    seconds: 50,
    dose: '10 reps per side',
    why: 'The best all-round back builder you can do with one dumbbell, and rowing directly counteracts desk posture.',
    cues: [
      'Same-side hand and knee on the bench, other foot planted, back flat and level.',
      'Let the dumbbell hang straight down, arm long, shoulder stretched.',
      'Pull the dumbbell to your hip — not your shoulder — leading with the elbow.',
      'Squeeze the shoulder blade at the top for a beat.',
      'Lower all the way down over 3 seconds. Do not twist your torso to lift it.'
    ]
  },
  {
    id: 'db-bent-row',
    name: 'Bent-Over Dumbbell Row',
    pack: PACK,
    groups: ['pull'],
    equipment: ['dumbbells'],
    minWeightLb: 15,
    setting: 'space',
    position: 'standing',
    intensity: 'moderate',
    perSide: false,
    seconds: 50,
    dose: '10 reps',
    why: 'Trains the whole back plus the hip hinge you are practising for your knee — with a soft knee held throughout.',
    cues: [
      'Feet hip-width, knees SOFT. Hinge at the hips until your torso is about 45 degrees.',
      'Back flat, dumbbells hanging straight down.',
      'Row both to your lower ribs, elbows tracking back past your body.',
      'Squeeze the shoulder blades together, then lower slowly.',
      'Hold the hinge position the whole set. Do not bob up and down.'
    ],
    caution: 'If your lower back rounds, the weight is too heavy or the hinge is too deep.'
  },
  {
    id: 'db-pullover',
    name: 'Dumbbell Pullover',
    pack: PACK,
    groups: ['pull'],
    equipment: ['dumbbells', 'bench'],
    minWeightLb: 15,
    setting: 'space',
    position: 'bench',
    intensity: 'moderate',
    perSide: false,
    seconds: 50,
    dose: '12 reps',
    why: 'Loads the lats through a big overhead stretch, which is also a genuine mobility gain for shoulders locked in a typing position.',
    cues: [
      'Lie on the bench holding one dumbbell over your chest, both hands cupping one end.',
      'Keep a soft, fixed bend in the elbows.',
      'Lower the dumbbell back over your head until you feel a stretch through the lats and ribs.',
      'Keep your ribs pulled down — do not let your back arch off the bench.',
      'Pull it back over your chest using your lats, not your arms.'
    ]
  },
  {
    id: 'pullup',
    name: 'Pull-Up / Chin-Up',
    pack: PACK,
    groups: ['pull'],
    equipment: ['pullupBar'],
    setting: 'space',
    position: 'standing',
    intensity: 'high',
    perSide: false,
    seconds: 45,
    dose: '5–10 reps, or slow negatives',
    why: 'The highest return-per-rep pulling exercise there is.',
    cues: [
      'Hang with your arms nearly straight, shoulders pulled down away from your ears.',
      'Brace your stomach so you do not swing.',
      'Pull your chest toward the bar, driving the elbows down and back.',
      'Lower over 3 seconds to a near-straight arm.',
      'If you cannot do full reps, jump to the top and lower as slowly as possible.'
    ]
  },

  // ------------------------------------------------------------- shoulders
  {
    id: 'db-shoulder-press',
    name: 'Dumbbell Shoulder Press',
    pack: PACK,
    groups: ['shoulders'],
    equipment: ['dumbbells'],
    minWeightLb: 15,
    setting: 'space',
    position: 'standing',
    intensity: 'moderate',
    perSide: false,
    seconds: 50,
    dose: '8–10 reps',
    why: 'Overhead strength, and pressing overhead forces the upper back to extend out of its slumped desk position.',
    cues: [
      'Stand with feet hip-width and knees SOFT, or sit upright on the bench.',
      'Dumbbells at shoulder height, palms facing forward.',
      'Brace your stomach and squeeze your glutes so your back does not arch.',
      'Press straight up until your arms are nearly straight, stopping short of locking.',
      'Lower under control back to shoulder height.'
    ],
    caution: 'If your lower back arches to get the weight up, go lighter or do it seated.'
  },
  {
    id: 'db-lateral-raise',
    name: 'Lateral Raise',
    pack: PACK,
    groups: ['shoulders'],
    equipment: ['dumbbells'],
    minWeightLb: 5,
    setting: 'space',
    position: 'standing',
    intensity: 'low',
    perSide: false,
    seconds: 45,
    dose: '12–15 reps, light',
    why: 'Builds the side of the shoulder, which nothing else in a home setup really hits.',
    cues: [
      'Stand tall, knees soft, a light dumbbell in each hand at your sides.',
      'Soft bend in the elbows, held constant.',
      'Raise your arms out to the sides until they reach shoulder height. No higher.',
      'Lead with the elbows, not the hands. Do not shrug.',
      'Lower over 3 seconds. This one is all about control, not weight.'
    ]
  },
  {
    id: 'db-rear-delt-flye',
    name: 'Bent-Over Rear Delt Flye',
    pack: PACK,
    groups: ['shoulders', 'pull'],
    equipment: ['dumbbells'],
    minWeightLb: 5,
    setting: 'space',
    position: 'standing',
    intensity: 'low',
    perSide: false,
    seconds: 45,
    dose: '15 reps, light',
    why: 'The back of the shoulder is the most neglected muscle in anyone who works at a screen, and it is what holds your shoulders back.',
    cues: [
      'Knees soft, hinge forward at the hips until your torso is close to parallel with the floor.',
      'Let light dumbbells hang straight down, soft elbows.',
      'Raise your arms out to the sides in a wide arc.',
      'Think about pulling your shoulder blades apart-then-together, not lifting with the hands.',
      'Stop at shoulder height and lower slowly.'
    ]
  },

  // ------------------------------------------------------------------ arms
  {
    id: 'db-curl',
    name: 'Dumbbell Curl',
    pack: PACK,
    groups: ['arms'],
    equipment: ['dumbbells'],
    minWeightLb: 10,
    setting: 'space',
    position: 'standing',
    intensity: 'low',
    perSide: false,
    seconds: 45,
    dose: '10–12 reps',
    why: 'Straightforward bicep work.',
    cues: [
      'Stand tall, knees soft, dumbbells at your sides, palms forward.',
      'Keep your elbows pinned at your ribs the whole time.',
      'Curl up without letting the elbows drift forward.',
      'Squeeze at the top for a beat.',
      'Lower over 3 seconds until the arm is nearly straight.'
    ]
  },
  {
    id: 'db-preacher-curl',
    name: 'Preacher Curl',
    pack: PACK,
    groups: ['arms'],
    equipment: ['dumbbells', 'curlPlatform'],
    minWeightLb: 10,
    setting: 'space',
    position: 'seated',
    intensity: 'low',
    perSide: true,
    seconds: 45,
    dose: '10 reps per side',
    why: 'The platform removes every chance to swing or cheat, so the bicep does all of it — especially at the hard stretched position.',
    cues: [
      'Set your upper arm flat along the pad, armpit against the top edge.',
      'Start with the arm nearly straight but not locked.',
      'Curl up smoothly. Keep the back of your arm glued to the pad.',
      'Lower over 3 seconds all the way to the stretch.',
      'Do not bounce out of the bottom — that is where biceps tear.'
    ],
    caution: 'Never let the weight drop into a snapped-straight elbow at the bottom.'
  },
  {
    id: 'db-hammer-curl',
    name: 'Hammer Curl',
    pack: PACK,
    groups: ['arms'],
    equipment: ['dumbbells'],
    minWeightLb: 10,
    setting: 'space',
    position: 'standing',
    intensity: 'low',
    perSide: false,
    seconds: 45,
    dose: '10–12 reps',
    why: 'Hits the brachialis and the forearm, which is useful insurance for wrists that spend all day typing.',
    cues: [
      'Stand tall, knees soft, palms facing each other like holding two hammers.',
      'Elbows stay pinned at your sides.',
      'Curl up keeping the palms facing inward the entire way.',
      'Squeeze at the top, then lower over 3 seconds.',
      'No swinging — if your body moves, go lighter.'
    ]
  },
  {
    id: 'db-overhead-triceps',
    name: 'Overhead Triceps Extension',
    pack: PACK,
    groups: ['arms'],
    equipment: ['dumbbells'],
    minWeightLb: 10,
    setting: 'space',
    position: 'standing',
    intensity: 'low',
    perSide: false,
    seconds: 45,
    dose: '12 reps',
    why: 'The overhead position stretches the long head of the triceps, which is the part a press alone misses.',
    cues: [
      'Hold one dumbbell with both hands, overhead, arms nearly straight.',
      'Knees soft, ribs down, stomach braced.',
      'Lower the weight behind your head by bending only at the elbows.',
      'Keep your upper arms pointing at the ceiling — they should not swing forward.',
      'Extend back up, stopping just short of locked.'
    ]
  }
]
