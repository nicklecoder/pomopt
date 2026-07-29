'use strict'

const $ = (id) => document.getElementById(id)

const el = {
  kind: $('kind'),
  dots: $('dots'),
  paused: $('paused'),
  breakClock: $('breakClock'),

  interstitial: $('interstitial'),
  interLabel: $('interLabel'),
  interTitle: $('interTitle'),
  interDose: $('interDose'),
  interFigure: $('interFigure'),
  interCount: $('interCount'),
  figureSlot: $('figureSlot'),

  exercise: $('exercise'),
  focusTag: $('focusTag'),
  sideTag: $('sideTag'),
  positionTag: $('positionTag'),
  exName: $('exName'),
  exDose: $('exDose'),
  segFill: $('segFill'),
  segClock: $('segClock'),
  cues: $('cues'),
  exWhy: $('exWhy'),
  cautionBox: $('cautionBox'),
  exCaution: $('exCaution'),

  btnPrev: $('btnPrev'),
  btnNext: $('btnNext'),
  btnMeeting: $('btnMeeting'),
  btnPause: $('btnPause'),
  btnSnooze: $('btnSnooze'),
  btnEnd: $('btnEnd')
}

// Filled from the pack catalogue at boot so the break screen can name an
// exercise's pack and group without hard-coding them.
let packName = new Map()
let groupLabel = new Map()

function primaryLabel (ex) {
  const key = `${ex.pack}:${ex.groups[0]}`
  return groupLabel.get(key) || packName.get(ex.pack) || ex.groups[0]
}

/**
 * What "left" and "right" refer to. "Left leg" is wrong for a spinal twist and
 * "Left side" is wrong for a row, so derive it from the exercise's first group.
 * An exercise can override with `sideNoun` when its group is a poor guide.
 */
const SIDE_NOUN_BY_GROUP = {
  hyperextension: 'leg', outtoe: 'leg', mobility: 'leg', circulation: 'leg',
  squat: 'leg', hinge: 'leg', lunge: 'leg', calves: 'leg',
  hips: 'leg', hamstrings: 'leg', balance: 'leg', flow: 'leg',
  push: 'arm', pull: 'arm', arms: 'arm',
  shoulders: 'shoulder', chestShoulders: 'shoulder'
}

function sideNoun (ex) {
  if (ex.sideNoun) return ex.sideNoun
  for (const g of ex.groups) {
    if (SIDE_NOUN_BY_GROUP[g]) return SIDE_NOUN_BY_GROUP[g]
  }
  return 'side'
}

function equipmentLabel (ex) {
  const bits = [ex.position]
  if (ex.equipment && ex.equipment.length) bits.push(ex.equipment.join(' · '))
  if (ex.minWeightLb) bits.push(`${ex.minWeightLb}lb+`)
  return bits.join(' · ')
}

function clock (seconds) {
  const s = Math.max(0, Math.ceil(seconds))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

// ---------------------------------------------------------------- rendering

let renderedExerciseKey = null
let dotCount = -1

// The animated diagram runs on a rAF loop, so it must be torn down whenever we
// move to a different exercise or a different slot.
let activeFigure = null
let activeFigureId = null

function clearFigure () {
  if (activeFigure) activeFigure.destroy()
  activeFigure = null
  activeFigureId = null
}

function mountFigure (slot, exerciseId) {
  if (activeFigureId === exerciseId && activeFigure && slot.contains(activeFigure.el)) return
  clearFigure()
  const figures = window.PomoptFigures
  const fig = figures && exerciseId ? figures.createFigure(exerciseId) : null
  activeFigureId = exerciseId
  if (fig) {
    activeFigure = fig
    slot.replaceChildren(fig.el)
    slot.hidden = false
  } else {
    slot.replaceChildren()
    slot.hidden = true
  }
}

function renderDots (view) {
  if (dotCount !== view.exerciseCount) {
    dotCount = view.exerciseCount
    el.dots.replaceChildren(
      ...Array.from({ length: view.exerciseCount }, () => {
        const d = document.createElement('span')
        d.className = 'dot'
        return d
      })
    )
  }
  ;[...el.dots.children].forEach((dot, i) => {
    dot.className =
      'dot' +
      (i < view.exerciseIndex ? ' done' : '') +
      (i === view.exerciseIndex && view.phase !== 'free' ? ' current' : '')
  })
}

function renderExercise (view) {
  const ex = view.exercise
  const key = `${ex.id}:${view.side}`
  if (key !== renderedExerciseKey) {
    renderedExerciseKey = key

    el.focusTag.textContent = primaryLabel(ex)
    el.positionTag.textContent = equipmentLabel(ex)

    if (view.side) {
      el.sideTag.hidden = false
      el.sideTag.textContent = `${view.side === 'left' ? 'Left' : 'Right'} ${sideNoun(ex)}`
    } else {
      el.sideTag.hidden = true
    }

    el.exName.textContent = ex.name
    el.exDose.textContent = ex.dose
    el.exWhy.textContent = ex.why

    el.cues.replaceChildren(
      ...ex.cues.map((c) => {
        const li = document.createElement('li')
        li.textContent = c
        return li
      })
    )

    if (ex.caution) {
      el.cautionBox.hidden = false
      el.exCaution.textContent = ex.caution
    } else {
      el.cautionBox.hidden = true
    }
  }

  mountFigure(el.figureSlot, ex.id)

  const pct = view.segmentTotal
    ? ((view.segmentTotal - view.segmentRemaining) / view.segmentTotal) * 100
    : 0
  el.segFill.style.width = `${Math.min(100, Math.max(0, pct))}%`
  el.segClock.textContent = clock(view.segmentRemaining)
}

function renderInterstitial (view) {
  renderedExerciseKey = null
  const ex = view.exercise

  mountFigure(el.interFigure, ex ? ex.id : null)

  if (view.phase === 'free') {
    el.interLabel.textContent = 'Sequence complete'
    el.interTitle.textContent = 'Move around until the timer runs out'
    el.interDose.textContent = 'Walk, shift your weight, keep the knees soft.'
  } else if (view.phase === 'switch') {
    el.interLabel.textContent = 'Switch sides'
    el.interTitle.textContent = view.side === 'right' ? 'Right leg' : 'Left leg'
    el.interDose.textContent = ex ? ex.name : ''
  } else {
    el.interLabel.textContent = `Next up — ${view.exerciseIndex + 1} of ${view.exerciseCount}`
    el.interTitle.textContent = ex ? ex.name : ''
    el.interDose.textContent = ex ? ex.dose : ''
  }

  el.interCount.textContent = Math.max(0, Math.ceil(view.segmentRemaining))
}

function render (view) {
  el.kind.textContent = view.kind === 'long' ? 'Long break' : 'Short break'
  el.breakClock.textContent = clock(view.breakRemaining)
  el.paused.hidden = view.running
  el.btnPause.textContent = view.running ? 'Pause' : 'Resume'

  renderDots(view)

  const isExercise = view.phase === 'exercise' && view.exercise
  el.exercise.hidden = !isExercise
  el.interstitial.hidden = isExercise

  if (isExercise) renderExercise(view)
  else renderInterstitial(view)
}

// ------------------------------------------------------------------- sound

let audioCtx = null
function tone (freqs, duration = 0.16, gainPeak = 0.06) {
  try {
    if (!audioCtx) audioCtx = new AudioContext()
    if (audioCtx.state === 'suspended') audioCtx.resume()
    const now = audioCtx.currentTime
    freqs.forEach((f, i) => {
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()
      osc.type = 'sine'
      osc.frequency.value = f
      const start = now + i * duration * 0.85
      gain.gain.setValueAtTime(0, start)
      gain.gain.linearRampToValueAtTime(gainPeak, start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
      osc.connect(gain).connect(audioCtx.destination)
      osc.start(start)
      osc.stop(start + duration + 0.02)
    })
  } catch (_) { /* audio is a nicety, never a failure */ }
}

const SOUNDS = {
  'break-start': () => tone([523.25, 659.25, 783.99], 0.22),
  'break-end': () => tone([783.99, 523.25], 0.2),
  'segment-start': () => tone([880], 0.12),
  'segment-end': () => tone([587.33], 0.12),
  'work-start': () => tone([440], 0.14)
}

// ---------------------------------------------------------------- hold-btns

let holdSeconds = 2

function wireHold (button, onComplete) {
  const fill = button.querySelector('.hold-fill')
  let raf = null
  let startedAt = 0

  const stop = () => {
    if (raf) cancelAnimationFrame(raf)
    raf = null
    fill.style.width = '0%'
  }

  const step = () => {
    const pct = ((performance.now() - startedAt) / (holdSeconds * 1000)) * 100
    fill.style.width = `${Math.min(100, pct)}%`
    if (pct >= 100) {
      stop()
      onComplete()
      return
    }
    raf = requestAnimationFrame(step)
  }

  button.addEventListener('pointerdown', (e) => {
    e.preventDefault()
    startedAt = performance.now()
    raf = requestAnimationFrame(step)
  })
  for (const ev of ['pointerup', 'pointerleave', 'pointercancel']) {
    button.addEventListener(ev, stop)
  }
}

// ------------------------------------------------------------------- wiring

el.btnPrev.addEventListener('click', () => window.pomopt.prevSegment())
el.btnNext.addEventListener('click', () => window.pomopt.nextSegment())
el.btnMeeting.addEventListener('click', () => window.pomopt.beginHold())
el.btnPause.addEventListener('click', () => window.pomopt.toggle())
wireHold(el.btnSnooze, () => window.pomopt.snoozeBreak())
wireHold(el.btnEnd, () => window.pomopt.endBreak())

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') window.pomopt.nextSegment()
  else if (e.key === 'ArrowLeft') window.pomopt.prevSegment()
  else if (e.key === ' ') { e.preventDefault(); window.pomopt.toggle() }
})

window.pomopt.onBreakView(render)

window.pomopt.onSound(({ kind }) => {
  // Only one screen makes noise.
  if (!window.pomopt.isPrimaryDisplay) return
  const play = SOUNDS[kind]
  if (play) play()
})

window.pomopt.onState((state) => {
  if (state.settings) holdSeconds = state.settings.skipHoldSeconds || 2
})

window.pomopt.bootstrap().then((state) => {
  if (state.settings) holdSeconds = state.settings.skipHoldSeconds || 2
})

window.pomopt.getCatalog().then((catalog) => {
  packName = new Map(catalog.packs.map((p) => [p.id, p.name]))
  groupLabel = new Map(
    catalog.packs.flatMap((p) => p.groups.map((g) => [`${p.id}:${g.id}`, g.label]))
  )
  // The catalogue may land after the first exercise has rendered; force a redraw.
  renderedExerciseKey = null
})
