'use strict'

/**
 * Cardio pack.
 *
 * Biased toward low-impact work. Repeated landing impact is the last thing a
 * knee mid-rehab needs, so the jumping options are marked high intensity (an
 * Office profile's intensity cap filters them out) and carry cautions.
 */

const PACK = 'cardio'

module.exports = [
  // ------------------------------------------------------------------ bike
  {
    id: 'bike-easy-spin',
    name: 'Easy Spin',
    pack: PACK,
    groups: ['bike'],
    equipment: ['bikeMachine'],
    setting: 'space',
    position: 'seated',
    intensity: 'low',
    perSide: false,
    seconds: 180,
    dose: 'Spin 3 minutes, easy',
    why: 'Cycling moves the knee through its range with almost no impact, which is close to ideal for feeding cartilage while it heals.',
    cues: [
      'Set the resistance low. This is a flush, not a workout.',
      'Check your saddle height: at the bottom of the stroke the knee should stay slightly bent, never straight.',
      'Keep a high, easy cadence — spin rather than grind.',
      'Point your knees straight ahead over your feet.',
      'Stay conversational. If you are breathing hard, drop the resistance.'
    ],
    caution: 'A saddle set too low makes the knee flex hard; too high makes it snap straight at the bottom. Both matter more for you than for most people.'
  },
  {
    id: 'bike-intervals',
    name: 'Bike Intervals',
    pack: PACK,
    groups: ['bike'],
    equipment: ['bikeMachine'],
    setting: 'space',
    position: 'seated',
    intensity: 'high',
    perSide: false,
    seconds: 240,
    dose: '4 × (20s hard / 40s easy)',
    why: 'A genuine cardio stimulus in four minutes, with none of the joint impact of running.',
    cues: [
      'Spin easy for 30 seconds to warm up.',
      'Go hard for 20 seconds — high effort, controlled form, knees tracking straight.',
      'Spin easy for 40 seconds.',
      'Repeat four times total.',
      'Finish with an easy spin until your breathing settles.'
    ],
    caution: 'You will be sweaty afterwards. Not one for ten minutes before a meeting.'
  },
  {
    id: 'bike-outdoor-loop',
    name: 'Ride Outside',
    pack: PACK,
    groups: ['bike'],
    equipment: ['bikeOutdoor'],
    setting: 'space',
    position: 'standing',
    intensity: 'moderate',
    perSide: false,
    seconds: 600,
    dose: 'Ride 10 minutes',
    closer: true,
    why: 'Daylight, a change of scene and low-impact knee movement all at once. The best possible use of a long break.',
    cues: [
      'Easy gear, high cadence. This is not a training ride.',
      'Keep a slight bend in the knee at the bottom of every pedal stroke.',
      'Knees track straight ahead — do not let them flare out.',
      'Stay seated on climbs if standing loads the knee.',
      'Head back when the timer goes.'
    ]
  },

  // ------------------------------------------------------------ bodyweight
  {
    id: 'march-in-place-cardio',
    name: 'Brisk March',
    pack: PACK,
    groups: ['bodyweight'],
    equipment: [],
    setting: 'desk',
    position: 'standing',
    intensity: 'low',
    perSide: false,
    seconds: 90,
    dose: 'March 90s',
    why: 'Raises your heart rate a little with zero impact and zero equipment, so it works anywhere including a small office.',
    cues: [
      'March on the spot, driving the knees up to hip height.',
      'Swing the opposite arm with each step.',
      'Land softly on a soft knee every time.',
      'Feet stay pointing straight ahead.',
      'Pick up the pace over the first 20 seconds, then hold it.'
    ]
  },
  {
    id: 'stair-climb',
    name: 'Stair Climb',
    pack: PACK,
    groups: ['bodyweight'],
    equipment: ['step'],
    setting: 'space',
    position: 'standing',
    intensity: 'moderate',
    perSide: false,
    seconds: 150,
    dose: 'Climb 2–3 minutes',
    why: 'Real cardio that also loads the knee through a controlled bend, which is exactly the range you want strong.',
    cues: [
      'Take the stairs one at a time at a steady pace.',
      'Place the whole foot on each step, toes straight ahead.',
      'Drive up through the heel, not the toes.',
      'Coming down is the part that matters: land softly and control the descent.',
      'Use the rail if the downward direction feels unstable.'
    ],
    caution: 'If descending stairs aggravates the knee, walk down slowly or take the lift down and only climb up.'
  },
  {
    id: 'step-up-cardio',
    name: 'Continuous Step-Ups',
    pack: PACK,
    groups: ['bodyweight'],
    equipment: ['step'],
    setting: 'space',
    position: 'standing',
    intensity: 'moderate',
    perSide: false,
    seconds: 120,
    dose: '2 minutes, alternating',
    why: 'Low-impact cardio with a controlled knee bend on every rep — a much better trade for your knee than jumping.',
    cues: [
      'Step up with one foot, then the other. Step down the same way.',
      'Whole foot on the step, pointing straight ahead.',
      'Drive through the heel of the stepping leg.',
      'Alternate the lead foot every 30 seconds or so.',
      'Keep it rhythmic. Softer and steadier beats faster.'
    ]
  },
  {
    id: 'jumping-jacks',
    name: 'Jumping Jacks',
    pack: PACK,
    groups: ['bodyweight'],
    equipment: [],
    setting: 'space',
    position: 'standing',
    intensity: 'high',
    perSide: false,
    seconds: 60,
    dose: '60s continuous',
    why: 'Fast whole-body warm-up when you have almost no time and no equipment.',
    cues: [
      'Land softly on the balls of your feet, letting the knees bend to absorb it.',
      'Never land on a straight leg.',
      'Keep your feet pointing forward as they travel out and in.',
      'Arms all the way overhead each rep.',
      'Stop early if your landings start getting heavy or noisy.'
    ],
    caution: 'This is repeated impact. If your knee is sore today, use Continuous Step-Ups instead.'
  }
]
