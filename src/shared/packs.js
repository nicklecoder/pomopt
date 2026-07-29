'use strict'

/**
 * Packs, groups and equipment.
 *
 * An exercise belongs to exactly one pack and one or more groups within it.
 * Packs and groups are toggled independently, so you can run "Upper body" but
 * only its pull work, or keep the whole knee program on while everything else
 * is off.
 *
 * Equipment is a flat catalogue. An exercise lists everything it needs; all of
 * it must be available before the exercise can be scheduled. Availability is
 * per-profile, so switching from Home to Office changes what exists.
 */

const EQUIPMENT = [
  // Things you have wherever you happen to be working
  { id: 'desk', label: 'Desk or counter to hold', section: 'Workspace' },
  { id: 'wall', label: 'Clear wall', section: 'Workspace' },
  { id: 'chair', label: 'Chair', section: 'Workspace' },
  { id: 'step', label: 'Step or stair', section: 'Workspace' },
  { id: 'floor', label: 'Floor space to lie down', section: 'Workspace' },
  { id: 'mat', label: 'Yoga mat', section: 'Workspace' },

  // Load
  { id: 'band', label: 'Resistance band', section: 'Weights' },
  { id: 'dumbbells', label: 'Dumbbells', section: 'Weights', hasWeight: true },
  { id: 'bench', label: 'Weight bench', section: 'Weights' },
  { id: 'benchIncline', label: 'Bench inclines / reclines', section: 'Weights' },
  { id: 'curlPlatform', label: 'Preacher curl platform', section: 'Weights' },
  { id: 'kettlebellHandle', label: 'Kettlebell handle for a dumbbell', section: 'Weights' },
  { id: 'abRoller', label: 'Ab roller', section: 'Weights' },
  { id: 'pullupBar', label: 'Pull-up bar', section: 'Weights' },

  // Cardio
  { id: 'bikeMachine', label: 'Bike machine / trainer', section: 'Cardio' },
  { id: 'bikeOutdoor', label: 'Bike and somewhere to ride', section: 'Cardio' }
]

const EQUIPMENT_IDS = EQUIPMENT.map((e) => e.id)

const PACKS = [
  {
    id: 'knee-pt',
    name: 'Knee PT',
    blurb: 'The rehab program: hyperextension control and out-toe correction.',
    // Anchor packs are guaranteed at least one slot in every break.
    anchorByDefault: true,
    groups: [
      { id: 'hyperextension', label: 'Hyperextension control' },
      { id: 'outtoe', label: 'Foot alignment / out-toeing' },
      { id: 'mobility', label: 'Ankle & hip mobility' },
      { id: 'circulation', label: 'Circulation' }
    ]
  },
  {
    id: 'upper',
    name: 'Upper body strength',
    blurb: 'Dumbbell and bodyweight pushing, pulling and arm work.',
    groups: [
      { id: 'push', label: 'Push (chest, triceps)' },
      { id: 'pull', label: 'Pull (back, biceps)' },
      { id: 'shoulders', label: 'Shoulders' },
      { id: 'arms', label: 'Arms (isolation)' }
    ]
  },
  {
    id: 'core',
    name: 'Core',
    blurb: 'Trunk work, weighted toward anti-movement rather than crunches.',
    groups: [
      { id: 'antiExtension', label: 'Anti-extension (planks, rollouts)' },
      { id: 'flexion', label: 'Flexion (crunch pattern)' },
      { id: 'rotation', label: 'Rotation & anti-rotation' },
      { id: 'lowBack', label: 'Lower back & posterior' }
    ]
  },
  {
    id: 'lower',
    name: 'Lower body strength',
    blurb: 'Squats, hinges and lunges. Every one is cued for a soft knee.',
    groups: [
      { id: 'squat', label: 'Squat pattern' },
      { id: 'hinge', label: 'Hinge pattern' },
      { id: 'lunge', label: 'Lunge / single leg' },
      { id: 'calves', label: 'Calves' }
    ]
  },
  {
    id: 'stretch',
    name: 'Stretching',
    blurb: 'Undoing a day at the desk.',
    groups: [
      { id: 'hips', label: 'Hips & glutes' },
      { id: 'hamstrings', label: 'Hamstrings & calves' },
      { id: 'chestShoulders', label: 'Chest & shoulders' },
      { id: 'spine', label: 'Spine' },
      { id: 'neck', label: 'Neck & forearms' }
    ]
  },
  {
    id: 'cardio',
    name: 'Cardio',
    blurb: 'Short efforts that fit in a break. Mind the intensity cap.',
    groups: [
      { id: 'bike', label: 'Bike' },
      { id: 'bodyweight', label: 'Bodyweight cardio' }
    ]
  },
  {
    id: 'yoga',
    name: 'Yoga',
    blurb: 'Poses and short flows. Balance work doubles as knee proprioception.',
    groups: [
      { id: 'flow', label: 'Flows' },
      { id: 'balance', label: 'Balance' },
      { id: 'restorative', label: 'Restorative' }
    ]
  }
]

const PACK_BY_ID = new Map(PACKS.map((p) => [p.id, p]))

const INTENSITY_ORDER = ['low', 'moderate', 'high']

/** True if `level` is at or below the cap. */
function withinIntensity (level, cap) {
  return INTENSITY_ORDER.indexOf(level) <= INTENSITY_ORDER.indexOf(cap)
}

module.exports = {
  EQUIPMENT,
  EQUIPMENT_IDS,
  PACKS,
  PACK_BY_ID,
  INTENSITY_ORDER,
  withinIntensity
}
