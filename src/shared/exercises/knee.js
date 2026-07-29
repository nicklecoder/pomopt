'use strict'

/**
 * Knee PT pack — the rehab program.
 *
 *  - `hyperextension` — genu recurvatum. Standing with the knees locked back
 *    loads the posterior capsule and ACL instead of the muscles. The fix is not
 *    stretching; it is quad and hamstring control through the last 30 degrees of
 *    extension, posterior-chain strength, and proprioception — relearning where
 *    "straight" actually is.
 *
 *  - `outtoe` — habitual external rotation of the stance leg ("duck feet").
 *    Usually some mix of tight deep hip external rotators, weak hip internal
 *    rotators and adductors, limited ankle dorsiflexion (the foot turns out to
 *    let the shin travel forward), and a collapsed arch. So we hit all four.
 */

const PACK = 'knee-pt'

module.exports = [
  // ---------------------------------------------------------------------
  // Hyperextension / terminal knee control
  // ---------------------------------------------------------------------
  {
    id: 'soft-knee-stance',
    name: 'Soft-Knee Stance Reset',
    pack: PACK,
    groups: ['hyperextension'],
    equipment: [],
    setting: 'desk',
    position: 'standing',
    intensity: 'low',
    perSide: false,
    seconds: 60,
    dose: 'Hold 60s',
    why: 'This is the exact posture you default to at the desk. Holding an unlocked knee under load is the single highest-value minute of your day.',
    cues: [
      'Stand tall, feet hip-width, weight even between both feet.',
      'Let the knees "unlock" — bend them maybe 5 degrees. It should feel like almost nothing.',
      'Feel your quads and glutes switch on to hold you there. That is the point: muscle holding you up instead of the joint.',
      'Keep breathing normally. Do not brace or hold your breath.',
      'Notice the urge to sink back into the lock. Resist it for the full minute.'
    ],
    caution: 'If you feel the knee snap backwards into the stop at any point, reset and start the hold again.'
  },
  {
    id: 'quad-set',
    name: 'Quad Set with Towel',
    pack: PACK,
    groups: ['hyperextension'],
    equipment: ['chair'],
    setting: 'desk',
    position: 'seated',
    intensity: 'low',
    perSide: true,
    seconds: 50,
    dose: '10 reps, 5s hold',
    why: 'Isolates the quad — especially the VMO — at a knee angle that is safely short of your hyperextended end range.',
    cues: [
      'Sit with the leg out straight, heel on the floor or a second chair.',
      'Put a rolled towel or hoodie under the knee so it rests in a slight bend.',
      'Press the back of the knee down into the towel and tighten the thigh hard.',
      'Hold 5 seconds. You should see the muscle just above the kneecap contract.',
      'Relax fully for 2 seconds, then repeat.'
    ],
    caution: 'Press into the towel — do not press the leg flat into the floor. Flat is where you hyperextend.'
  },
  {
    id: 'tke-band',
    name: 'Terminal Knee Extension (band)',
    pack: PACK,
    groups: ['hyperextension'],
    equipment: ['band'],
    setting: 'desk',
    position: 'standing',
    intensity: 'low',
    perSide: true,
    seconds: 45,
    dose: '12 reps, slow',
    why: 'The standard rehab exercise for recurvatum. Trains the quad to own the last few degrees of extension so the joint capsule does not have to.',
    cues: [
      'Anchor a resistance band at knee height. Loop it around the back of one knee.',
      'Step back until the band is taut. That leg is the working leg, foot flat.',
      'Start with the knee softly bent. Straighten it against the band pull.',
      'Stop just SHORT of fully straight. Hold 2 seconds there.',
      'Let the band slowly bend the knee again. Control the return; do not let it snap.'
    ],
    caution: 'Never let the band pull you into the locked position. Short of straight is the whole exercise.'
  },
  {
    id: 'standing-ham-curl',
    name: 'Standing Hamstring Curl',
    pack: PACK,
    groups: ['hyperextension'],
    equipment: ['desk'],
    setting: 'desk',
    position: 'standing',
    intensity: 'low',
    perSide: true,
    seconds: 45,
    dose: '12 reps, slow',
    why: 'Hamstrings are the primary brake against the knee travelling backwards. Yours are being under-used every hour you stand locked out.',
    cues: [
      'Hold the edge of the desk for balance. Stand tall.',
      'Keep the thighs level with each other — do not let the working knee drift forward.',
      'Curl the heel up toward your backside. Squeeze at the top for 1 second.',
      'Lower over a slow 3-count. The lowering half is where the strength is built.',
      'Keep the standing leg soft, not locked.'
    ]
  },
  {
    id: 'glute-bridge',
    name: 'Glute Bridge',
    pack: PACK,
    groups: ['hyperextension'],
    equipment: ['floor'],
    setting: 'space',
    position: 'floor',
    intensity: 'low',
    perSide: false,
    seconds: 60,
    dose: '12 reps, 2s hold',
    why: 'Loads the whole posterior chain — glutes and hamstrings — which is what should be holding your standing posture instead of your knee joint.',
    cues: [
      'Lie on your back, knees bent, feet flat and hip-width, heels close to your backside.',
      'Push through your HEELS, not your toes.',
      'Lift the hips until your body makes a straight line from knee to shoulder.',
      'Squeeze the glutes hard for 2 seconds at the top.',
      'Lower slowly. Do not let the lower back arch to get higher.'
    ]
  },
  {
    id: 'single-leg-balance',
    name: 'Single-Leg Balance, Soft Knee',
    pack: PACK,
    groups: ['hyperextension'],
    equipment: [],
    setting: 'desk',
    position: 'standing',
    intensity: 'low',
    perSide: true,
    seconds: 30,
    dose: 'Hold 30s per leg',
    why: 'Proprioception — knowing where your joint is without looking — is the deficit that lets a knee drift into hyperextension unnoticed.',
    cues: [
      'Stand on one leg near the desk in case you need to catch yourself.',
      'Keep the standing knee softly bent the entire time. This is non-negotiable.',
      'Fix your eyes on one point ahead of you.',
      'Let the small stabilising muscles in your foot and hip do the wobbling.',
      'If it feels easy, close your eyes for the last 10 seconds.'
    ],
    caution: 'The moment the standing knee locks, you have stopped doing the exercise. Rebend and continue.'
  },
  {
    id: 'shallow-wall-sit',
    name: 'Shallow Wall Sit',
    pack: PACK,
    groups: ['hyperextension'],
    equipment: ['wall'],
    setting: 'desk',
    position: 'standing',
    intensity: 'moderate',
    perSide: false,
    seconds: 45,
    dose: 'Hold 45s',
    why: 'Builds quad endurance in a bent position — the opposite of the locked-out endurance your knee has been accumulating all day.',
    cues: [
      'Back flat against the wall, feet about two boot-lengths out in front.',
      'Slide down until the knees are bent 30 to 45 degrees. This is shallow — nowhere near a 90-degree squat.',
      'Knees track over the second toe. Do not let them fall inward or outward.',
      'Push your back into the wall and hold. Breathe.',
      'Stand back up by pushing through the heels.'
    ]
  },
  {
    id: 'hip-hinge',
    name: 'Bodyweight Hip Hinge',
    pack: PACK,
    groups: ['hyperextension'],
    equipment: [],
    setting: 'desk',
    position: 'standing',
    intensity: 'low',
    perSide: false,
    seconds: 50,
    dose: '10 reps, slow',
    why: 'Teaches you to bend at the hip with a soft knee, which is the movement pattern that keeps the load off the knee joint.',
    cues: [
      'Feet hip-width, knees SOFT and held at that same soft angle throughout.',
      'Push your hips straight backwards, like closing a car door with your backside.',
      'Let your chest lower as the hips travel back. Keep your back flat.',
      'Go until you feel a firm stretch in the hamstrings. That is deep enough.',
      'Drive the hips forward to stand, squeezing the glutes — but stop before locking the knees.'
    ]
  },
  {
    id: 'step-down',
    name: 'Eccentric Step-Down',
    pack: PACK,
    groups: ['hyperextension'],
    equipment: ['step'],
    setting: 'desk',
    position: 'standing',
    intensity: 'moderate',
    perSide: true,
    seconds: 45,
    dose: '8 reps, 3s lower',
    why: 'Trains controlled knee extension under load, which is what fails when a hyperextending knee "snaps" straight during walking.',
    cues: [
      'Stand on a bottom stair or a sturdy low step, one foot at the edge.',
      'Hold a wall or rail. Let the other foot hang off the side.',
      'Bend the standing knee slowly over 3 seconds, tapping the free heel to the floor.',
      'Do not put weight on the tapping foot — the standing leg does all the work.',
      'Come back up smoothly and stop just short of straight.'
    ],
    caution: 'Skip this one if it produces pain at the front of the knee, and pick another exercise.'
  },

  // ---------------------------------------------------------------------
  // Out-toeing / hip internal rotation / foot
  // ---------------------------------------------------------------------
  {
    id: 'toes-forward-drill',
    name: 'Toes-Forward Calibration',
    pack: PACK,
    groups: ['outtoe'],
    equipment: ['desk'],
    setting: 'desk',
    position: 'standing',
    intensity: 'low',
    perSide: false,
    seconds: 60,
    dose: 'Hold 60s, then 10 steps',
    why: 'The direct habit retrain. Your sense of "straight" is miscalibrated — this rebuilds it against an external reference instead of feel.',
    cues: [
      'Find a straight line on the floor: a floorboard seam, a tile edge, the front edge of your desk.',
      'Place your feet so the OUTER edges of both feet are parallel with that line.',
      'It will feel pigeon-toed and wrong. That feeling is the miscalibration you are correcting.',
      'Hold the position for the full minute. Keep the knees soft.',
      'Then walk 10 slow steps, deliberately placing each foot pointing straight ahead.'
    ]
  },
  {
    id: 'gastroc-stretch',
    name: 'Calf Stretch — Straight Knee',
    pack: PACK,
    groups: ['outtoe', 'mobility'],
    equipment: ['wall'],
    setting: 'desk',
    position: 'standing',
    intensity: 'low',
    perSide: true,
    seconds: 40,
    dose: 'Hold 40s per side',
    why: 'A tight calf blocks the ankle from bending forward, so the foot turns outward to get around the restriction. It also pulls the knee backwards into hyperextension.',
    cues: [
      'Hands on the wall, one foot back, one foot forward.',
      'Back leg straight, back heel pressed flat to the floor.',
      'Point the back foot STRAIGHT at the wall — this matters more than the stretch itself.',
      'Lean your hips toward the wall until you feel it in the upper calf.',
      'Hold and breathe. Do not bounce.'
    ]
  },
  {
    id: 'soleus-stretch',
    name: 'Calf Stretch — Bent Knee',
    pack: PACK,
    groups: ['outtoe', 'mobility'],
    equipment: ['wall'],
    setting: 'desk',
    position: 'standing',
    intensity: 'low',
    perSide: true,
    seconds: 40,
    dose: 'Hold 40s per side',
    why: 'The soleus sits under the calf and is the muscle that actually limits your ankle while standing. It is the one most people never stretch.',
    cues: [
      'Same setup as the straight-knee calf stretch, but stand a bit closer to the wall.',
      'Bend the BACK knee while keeping that heel glued to the floor.',
      'Back foot still pointing straight at the wall.',
      'Sink down and slightly forward. The stretch moves lower, near the Achilles.',
      'Hold and breathe.'
    ]
  },
  {
    id: 'knee-to-wall',
    name: 'Knee-to-Wall Ankle Drill',
    pack: PACK,
    groups: ['outtoe', 'mobility'],
    equipment: ['wall'],
    setting: 'desk',
    position: 'standing',
    intensity: 'low',
    perSide: true,
    seconds: 40,
    dose: '10 reps, 2s hold',
    why: 'Restores forward ankle range and simultaneously trains the knee to travel straight over the foot instead of angling out.',
    cues: [
      'Place your foot about a hand-width from the wall, toes pointing straight at it.',
      'Keep the heel pinned to the floor for every rep.',
      'Drive the knee forward to touch the wall, tracking it directly over your SECOND TOE.',
      'Hold for 2 seconds at the wall, then return.',
      'If the heel lifts, move the foot closer to the wall and continue.'
    ]
  },
  {
    id: 'seated-hip-ir',
    name: 'Seated Hip Internal Rotation',
    pack: PACK,
    groups: ['outtoe'],
    equipment: ['chair'],
    setting: 'desk',
    position: 'seated',
    intensity: 'low',
    perSide: true,
    seconds: 45,
    dose: '12 reps, 3s hold',
    why: 'Weak hip internal rotators are the main driver of duck feet. This trains exactly that motion against resistance.',
    cues: [
      'Sit tall on a chair, knees bent 90 degrees, feet flat and hip-width.',
      'Keeping the knee still, swing that foot OUTWARD, away from the midline.',
      'That is hip internal rotation — the thigh bone rolling inward. Yes, foot out equals hip in.',
      'Use your hand on the outside of the ankle to give light resistance.',
      'Hold 3 seconds at end range, return slowly.'
    ]
  },
  {
    id: 'standing-hip-ir',
    name: 'Standing Hip Internal Rotation',
    pack: PACK,
    groups: ['outtoe'],
    equipment: ['desk'],
    setting: 'desk',
    position: 'standing',
    intensity: 'low',
    perSide: true,
    seconds: 40,
    dose: '10 reps, 3s hold',
    why: 'Same motion as the seated version, but loaded through a planted foot — which is how it actually has to work when you stand at the desk.',
    cues: [
      'Stand with feet straight ahead, one hand on the desk. Knees soft.',
      'Keep both feet completely still and flat on the floor.',
      'Rotate your PELVIS away from the working leg, so that thigh rolls inward.',
      'You should feel it deep in the side of the hip. Hold 3 seconds.',
      'Return to square and repeat.'
    ]
  },
  {
    id: 'figure-four',
    name: 'Figure-4 Glute & Piriformis Stretch',
    pack: PACK,
    groups: ['outtoe', 'mobility'],
    equipment: ['chair'],
    setting: 'desk',
    position: 'seated',
    intensity: 'low',
    perSide: true,
    seconds: 45,
    dose: 'Hold 45s per side',
    why: 'The deep external rotators are what physically hold your leg turned out. Lengthening them lets the foot come back to neutral.',
    cues: [
      'Sit tall. Place one ankle across the opposite knee, making a figure 4.',
      'Let that knee drop open toward the floor. Do not push it down with force.',
      'Keep your back flat and hinge forward from the HIPS, not by rounding your spine.',
      'You should feel it deep in the backside of the crossed leg.',
      'Breathe out as you sink a little further. Hold.'
    ]
  },
  {
    id: 'short-foot',
    name: 'Short Foot (Arch Doming)',
    pack: PACK,
    groups: ['outtoe'],
    equipment: [],
    setting: 'desk',
    position: 'seated',
    intensity: 'low',
    perSide: true,
    seconds: 40,
    dose: '8 reps, 5s hold',
    why: 'A collapsing arch rotates the whole leg outward from the ground up. This wakes up the muscles that hold the arch.',
    cues: [
      'Foot flat on the floor, weight on the heel and the ball of the foot.',
      'Without curling your toes, draw the ball of the foot slightly toward the heel.',
      'The arch should rise. Your toes stay long and flat — this is the hard part.',
      'Hold 5 seconds, feeling the muscle work in the sole of your foot.',
      'Relax completely, then repeat.'
    ],
    caution: 'If your toes are gripping or curling, you are cheating. Back off and use less effort.'
  },
  {
    id: 'adductor-squeeze',
    name: 'Adductor Squeeze',
    pack: PACK,
    groups: ['outtoe'],
    equipment: ['chair'],
    setting: 'desk',
    position: 'seated',
    intensity: 'low',
    perSide: false,
    seconds: 45,
    dose: '10 reps, 5s hold',
    why: 'The inner thigh assists hip internal rotation and pulls the leg back toward the midline. It goes quiet when you stand turned out all day.',
    cues: [
      'Sit tall, feet flat, knees bent 90 degrees.',
      'Put a fist, a rolled towel, or a water bottle between your knees.',
      'Squeeze the knees together at about 70 percent effort.',
      'Hold 5 seconds while breathing normally.',
      'Release slowly and repeat.'
    ]
  },
  {
    id: 'tib-raises',
    name: 'Tibialis Anterior Raises',
    pack: PACK,
    groups: ['outtoe'],
    equipment: ['wall'],
    setting: 'desk',
    position: 'standing',
    intensity: 'low',
    perSide: false,
    seconds: 40,
    dose: '15 reps, slow',
    why: 'Strengthens the shin muscle that lifts the foot. It balances your calf and supports the forward ankle range that stops you turning out.',
    cues: [
      'Stand with your back against a wall, heels about a foot out from it.',
      'Feet pointing straight ahead, hip-width apart.',
      'Keeping the heels down, lift your toes and the front of your feet as high as you can.',
      'Hold for 1 second at the top. You should feel the front of the shin burning.',
      'Lower over a slow 3-count.'
    ]
  },
  {
    id: 'ninety-ninety',
    name: '90/90 Hip Switches',
    pack: PACK,
    groups: ['outtoe', 'mobility'],
    equipment: ['floor'],
    setting: 'space',
    position: 'floor',
    intensity: 'low',
    perSide: false,
    seconds: 60,
    dose: '8 switches, slow',
    why: 'The most complete drill for hip rotation in both directions. Trains internal rotation actively rather than just stretching the outside.',
    cues: [
      'Sit on the floor. Front leg bent 90 degrees in front of you, back leg bent 90 degrees out to the side.',
      'Sit tall — hands behind you for support is fine.',
      'Lift both knees and rotate them over to the other side, swapping which leg is in front.',
      'Move slowly and under control. Let the knees pass through the middle.',
      'Do not force the range. Go as far as you can while staying upright.'
    ]
  },

  // ---------------------------------------------------------------------
  // Circulation / standing-desk relief
  // ---------------------------------------------------------------------
  {
    id: 'calf-pumps',
    name: 'Calf Pumps',
    pack: PACK,
    groups: ['circulation'],
    equipment: ['desk'],
    setting: 'desk',
    position: 'standing',
    intensity: 'low',
    perSide: false,
    seconds: 40,
    dose: '20 reps',
    why: 'Your calves are the pump that moves blood back up out of your legs. Standing still switches that pump off.',
    cues: [
      'Hold the desk lightly. Feet straight ahead, hip-width.',
      'Rise up onto the balls of both feet as high as you can.',
      'Pause 1 second at the top.',
      'Lower slowly all the way down until the heels touch.',
      'Keep the knees soft throughout — do not lock them at the top.'
    ]
  },
  {
    id: 'hip-flexor-stretch',
    name: 'Half-Kneeling Hip Flexor Stretch',
    pack: PACK,
    groups: ['circulation', 'mobility'],
    equipment: ['floor'],
    setting: 'space',
    position: 'floor',
    intensity: 'low',
    perSide: true,
    seconds: 45,
    dose: 'Hold 45s per side',
    why: 'A whole day at a desk shortens the hip flexors, which tips the pelvis forward and pushes the legs into that turned-out stance.',
    cues: [
      'Kneel on one knee, the other foot flat in front, both pointing straight ahead.',
      'Squeeze the glute on the KNEELING side. This is what actually creates the stretch.',
      'Tuck your tailbone under so your lower back flattens.',
      'Shift your weight gently forward. Keep the tuck.',
      'You should feel it at the front of the hip, not in the lower back.'
    ]
  },
  {
    id: 'marching',
    name: 'Toes-Forward Marching',
    pack: PACK,
    groups: ['circulation', 'outtoe'],
    equipment: [],
    setting: 'desk',
    position: 'standing',
    intensity: 'low',
    perSide: false,
    seconds: 45,
    dose: '30 steps in place',
    why: 'Gets blood moving while giving you 30 reps of practising foot placement pointing straight ahead.',
    cues: [
      'March in place, lifting the knee to about hip height.',
      'Watch your feet: each foot must land pointing STRAIGHT ahead.',
      'Land softly, on a soft knee. No snapping the leg straight.',
      'Keep a steady, unhurried rhythm.',
      'Swing the opposite arm naturally.'
    ]
  },
  {
    id: 'walk-it-out',
    name: 'Walk It Out',
    pack: PACK,
    groups: ['circulation'],
    equipment: [],
    setting: 'space',
    position: 'standing',
    intensity: 'low',
    perSide: false,
    seconds: 180,
    dose: 'Walk 3 minutes',
    closer: true,
    why: 'Nothing beats actual walking for joint nutrition — cartilage has no blood supply and is fed by movement alone.',
    cues: [
      'Leave the desk. Go somewhere — kitchen, hallway, outside.',
      'Walk at an easy conversational pace.',
      'Every so often, check your feet: are they pointing straight ahead?',
      'Let the knee bend and straighten naturally. Do not think about it too hard.',
      'Come back when the timer ends.'
    ]
  }
]
