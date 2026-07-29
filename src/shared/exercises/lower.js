'use strict'

/**
 * Lower body strength pack.
 *
 * Every exercise here is cued to finish short of a locked knee. Loaded leg work
 * is the highest-risk place to rehearse hyperextension, so the "stop short of
 * straight" instruction appears in the cues rather than only in a caution.
 */

const PACK = 'lower'

module.exports = [
  // ---------------------------------------------------------------- squat
  {
    id: 'bw-box-squat',
    name: 'Chair Squat',
    pack: PACK,
    groups: ['squat'],
    equipment: ['chair'],
    setting: 'desk',
    position: 'standing',
    intensity: 'low',
    perSide: false,
    seconds: 45,
    dose: '12 reps',
    why: 'A squat with a built-in depth limit, so you get quad work without ever hunting for a range your knee is not ready for.',
    cues: [
      'Stand in front of the chair, feet hip-width, toes pointing STRAIGHT ahead.',
      'Push your hips back first, then bend the knees.',
      'Touch the chair lightly with your backside — do not flop onto it.',
      'Drive up through your heels and midfoot.',
      'Stand up to tall, but stop just short of locking the knees.'
    ]
  },
  {
    id: 'db-goblet-squat',
    name: 'Goblet Squat',
    pack: PACK,
    groups: ['squat'],
    equipment: ['dumbbells'],
    minWeightLb: 20,
    setting: 'space',
    position: 'standing',
    intensity: 'moderate',
    perSide: false,
    seconds: 55,
    dose: '10 reps',
    why: 'Holding the weight in front acts as a counterbalance, which lets you sit down between your hips with an upright chest instead of tipping forward.',
    cues: [
      'Hold one dumbbell vertically against your chest, both hands cupping the top end.',
      'Feet shoulder-width, toes pointing straight ahead or very slightly out.',
      'Sit straight down, knees tracking over your second toes.',
      'Go as deep as you can keep your chest up and heels down.',
      'Drive up. Finish tall with the knees soft, not locked.'
    ],
    caution: 'Do not let the knees collapse inward on the way up. If they do, go lighter.'
  },
  {
    id: 'db-split-squat',
    name: 'Split Squat',
    pack: PACK,
    groups: ['squat', 'lunge'],
    equipment: ['dumbbells'],
    minWeightLb: 15,
    setting: 'space',
    position: 'standing',
    intensity: 'moderate',
    perSide: true,
    seconds: 50,
    dose: '8 reps per side',
    why: 'Single-leg strength with a stable base. The staggered stance also demands the hip stability that keeps your knee tracking straight.',
    cues: [
      'Long stride, front foot flat, back heel up. Both feet pointing straight ahead.',
      'Dumbbells hanging at your sides, chest tall.',
      'Lower straight down until the back knee is just off the floor.',
      'Keep about 70 percent of your weight on the front foot.',
      'Push through the front heel to rise, stopping short of a locked knee.'
    ]
  },

  // ---------------------------------------------------------------- hinge
  {
    id: 'db-rdl',
    name: 'Dumbbell Romanian Deadlift',
    pack: PACK,
    groups: ['hinge'],
    equipment: ['dumbbells'],
    minWeightLb: 20,
    setting: 'space',
    position: 'standing',
    intensity: 'moderate',
    perSide: false,
    seconds: 55,
    dose: '10 reps, slow',
    why: 'The best hamstring builder you can load at home, and hamstrings are your primary defence against the knee travelling backwards.',
    cues: [
      'Feet hip-width, dumbbells in front of your thighs, knees SOFT.',
      'Fix that soft knee angle and do not change it for the whole set.',
      'Push your hips straight back, letting the dumbbells slide down your thighs.',
      'Stop when you feel a strong hamstring stretch and your back is still flat.',
      'Drive your hips forward to stand. Squeeze the glutes — do not lean back.'
    ],
    caution: 'If the knees straighten as you lower, you have turned this into a stiff-leg deadlift and you are loading the joint you are trying to protect.'
  },
  {
    id: 'db-single-leg-rdl',
    name: 'Single-Leg Romanian Deadlift',
    pack: PACK,
    groups: ['hinge', 'lunge'],
    equipment: ['dumbbells'],
    minWeightLb: 10,
    setting: 'space',
    position: 'standing',
    intensity: 'moderate',
    perSide: true,
    seconds: 50,
    dose: '8 reps per side, slow',
    why: 'Hamstring strength plus balance on one soft knee — it is a loaded version of the proprioception drill your knee needs.',
    cues: [
      'Stand on one leg, that knee SOFT. One dumbbell in the opposite hand.',
      'Hinge at the hip, letting the free leg travel straight back as a counterweight.',
      'Keep your hips square to the floor — do not let the free hip open upward.',
      'Lower until you feel the hamstring load, back flat.',
      'Return to standing without locking the standing knee.'
    ],
    caution: 'Go lighter than you expect. Balance fails long before the hamstring does.'
  },
  {
    id: 'kb-swing',
    name: 'Kettlebell Swing',
    pack: PACK,
    groups: ['hinge'],
    equipment: ['dumbbells', 'kettlebellHandle'],
    minWeightLb: 25,
    setting: 'space',
    position: 'standing',
    intensity: 'high',
    perSide: false,
    seconds: 45,
    dose: '15 reps',
    why: 'A powerful hip hinge that trains the glutes and hamstrings explosively while barely loading the knee at all.',
    cues: [
      'Clip the handle onto a dumbbell. Feet a little wider than hip-width, toes straight ahead.',
      'Hinge at the hips — knees stay SOFT and mostly still. This is not a squat.',
      'Hike the weight back between your legs like a rugby pass.',
      'Snap your hips forward hard and squeeze the glutes. The weight floats up on its own.',
      'Let it swing back down and immediately hinge again. Arms stay relaxed throughout.'
    ],
    caution: 'The power comes from the hips snapping, never from lifting with the arms or squatting the weight up.'
  },

  // ---------------------------------------------------------------- lunge
  {
    id: 'reverse-lunge',
    name: 'Reverse Lunge',
    pack: PACK,
    groups: ['lunge'],
    equipment: [],
    setting: 'space',
    position: 'standing',
    intensity: 'moderate',
    perSide: true,
    seconds: 45,
    dose: '10 reps per side',
    why: 'Stepping backwards rather than forwards keeps the shear force off the front knee, which makes it the friendlier lunge for a knee in rehab.',
    cues: [
      'Stand tall, feet hip-width, toes straight ahead.',
      'Step one foot straight back and lower until the back knee nearly touches.',
      'Keep the front shin close to vertical and the front heel planted.',
      'Push through the FRONT heel to return to standing.',
      'Finish with the knees soft. Do not snap up to locked.'
    ]
  },
  {
    id: 'db-step-up',
    name: 'Dumbbell Step-Up',
    pack: PACK,
    groups: ['lunge'],
    equipment: ['step', 'dumbbells'],
    minWeightLb: 15,
    setting: 'space',
    position: 'standing',
    intensity: 'moderate',
    perSide: true,
    seconds: 50,
    dose: '8 reps per side',
    why: 'Loaded single-leg work through exactly the knee range you use on stairs, with a controlled lowering phase.',
    cues: [
      'Dumbbells at your sides. Place one whole foot on the step, pointing straight ahead.',
      'Drive through that heel to stand up on the step.',
      'Do not push off the trailing foot — the working leg does all of it.',
      'Stand up to a soft knee, never a locked one.',
      'Lower back down over 3 seconds. The lowering is the valuable half.'
    ]
  },

  // --------------------------------------------------------------- calves
  {
    id: 'db-calf-raise',
    name: 'Weighted Calf Raise',
    pack: PACK,
    groups: ['calves'],
    equipment: ['dumbbells', 'step'],
    minWeightLb: 15,
    setting: 'space',
    position: 'standing',
    intensity: 'low',
    perSide: false,
    seconds: 50,
    dose: '15 reps, 2s hold',
    why: 'Strong calves support the ankle range that stops your feet turning out, and a full stretch at the bottom is mobility work as well as strength.',
    cues: [
      'Stand with the balls of your feet on the edge of a step, dumbbells at your sides.',
      'Feet pointing straight ahead — this is what makes it count for your alignment.',
      'Let the heels drop below the step until you feel a calf stretch.',
      'Rise up as high as you can and hold for 2 seconds at the top.',
      'Lower over 3 seconds. Keep the knees soft, not locked.'
    ]
  },
  {
    id: 'seated-calf-raise',
    name: 'Seated Calf Raise',
    pack: PACK,
    groups: ['calves'],
    equipment: ['chair', 'dumbbells'],
    minWeightLb: 15,
    setting: 'space',
    position: 'seated',
    intensity: 'low',
    perSide: false,
    seconds: 45,
    dose: '15 reps',
    why: 'A bent knee takes the big calf muscle out and targets the soleus underneath — the one that actually limits your ankle while standing.',
    cues: [
      'Sit with knees bent 90 degrees, feet flat and pointing straight ahead.',
      'Rest a dumbbell on each thigh, just above the knee.',
      'Push through the balls of your feet to raise your heels as high as possible.',
      'Hold at the top for a beat.',
      'Lower slowly until the heels are flat.'
    ]
  }
]
