'use strict'

const $ = (id) => document.getElementById(id)

const LEAD = {
  short: 'A short break is about to take the screen.',
  long: 'A long break is about to take the screen.'
}

function render (state) {
  if (state.mode !== 'warn') return

  const kind = state.pendingBreakKind === 'long' ? 'long' : 'short'
  $('kind').textContent = kind === 'long' ? 'Long break' : 'Short break'
  $('lead').textContent = LEAD[kind]
  $('count').textContent = Math.max(0, Math.ceil(state.remainingSeconds))
}

$('btnHold').addEventListener('click', () => window.pomopt.beginHold())
$('btnSnooze').addEventListener('click', () => window.pomopt.snoozeBreak())
$('btnNow').addEventListener('click', () => window.pomopt.startBreakNow())

// The break windows own the sound map, but they are closed during the warning,
// so this panel plays its own cue.
let audioCtx = null
function chime () {
  try {
    if (!audioCtx) audioCtx = new AudioContext()
    if (audioCtx.state === 'suspended') audioCtx.resume()
    const now = audioCtx.currentTime
    ;[587.33, 880].forEach((f, i) => {
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()
      osc.type = 'sine'
      osc.frequency.value = f
      const start = now + i * 0.14
      gain.gain.setValueAtTime(0, start)
      gain.gain.linearRampToValueAtTime(0.05, start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.18)
      osc.connect(gain).connect(audioCtx.destination)
      osc.start(start)
      osc.stop(start + 0.2)
    })
  } catch (_) { /* audio is a nicety, never a failure */ }
}

window.pomopt.onState(render)

window.pomopt.bootstrap().then((state) => {
  render(state)
  // Chime on load rather than from the broadcast: main emits the cue while this
  // window is still loading, so the listener would not exist yet. This panel
  // only ever exists during a warning, so opening is the right moment.
  if (state.settings && state.settings.soundEnabled) chime()
})
