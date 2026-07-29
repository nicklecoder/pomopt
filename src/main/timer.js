'use strict'

const { EventEmitter } = require('events')

const TICK_MS = 250

/**
 * Wall-clock driven phase timer.
 *
 * Remaining time is always derived from an absolute end timestamp rather than
 * accumulated ticks, so it stays accurate across throttled timers and laptop
 * sleep. Phases are: 'idle' | 'work' | 'short' | 'long'.
 */
class Timer extends EventEmitter {
  constructor () {
    super()
    this.mode = 'idle'
    this.running = false
    this.totalSeconds = 0
    this.endsAt = null // ms epoch, when running
    this.pausedRemaining = 0 // seconds, when paused
    this.completedPomodoros = 0
    this._interval = null
    this._lastWhole = null
  }

  get remainingSeconds () {
    if (this.mode === 'idle') return 0
    if (!this.running) return this.pausedRemaining
    return Math.max(0, (this.endsAt - Date.now()) / 1000)
  }

  get elapsedSeconds () {
    return Math.max(0, this.totalSeconds - this.remainingSeconds)
  }

  snapshot () {
    const remaining = this.remainingSeconds
    return {
      mode: this.mode,
      running: this.running,
      remainingSeconds: remaining,
      totalSeconds: this.totalSeconds,
      elapsedSeconds: this.totalSeconds - remaining,
      completedPomodoros: this.completedPomodoros
    }
  }

  startPhase (mode, seconds) {
    this.mode = mode
    this.totalSeconds = seconds
    this.pausedRemaining = seconds
    this.endsAt = Date.now() + seconds * 1000
    this.running = true
    this._lastWhole = null
    this._ensureTicking()
    this.emit('phase-start', this.snapshot())
    this.emit('tick', this.snapshot())
  }

  pause () {
    if (!this.running || this.mode === 'idle') return
    this.pausedRemaining = this.remainingSeconds
    this.running = false
    this.endsAt = null
    this._stopTicking()
    this.emit('tick', this.snapshot())
  }

  resume () {
    if (this.running || this.mode === 'idle') return
    this.endsAt = Date.now() + this.pausedRemaining * 1000
    this.running = true
    this._ensureTicking()
    this.emit('tick', this.snapshot())
  }

  toggle () {
    if (this.mode === 'idle') return
    this.running ? this.pause() : this.resume()
  }

  /** Add (or, with a negative value, remove) time from the current phase. */
  adjust (deltaSeconds) {
    if (this.mode === 'idle') return
    if (this.running) {
      this.endsAt = Math.max(Date.now(), this.endsAt + deltaSeconds * 1000)
    } else {
      this.pausedRemaining = Math.max(0, this.pausedRemaining + deltaSeconds)
    }
    this.totalSeconds = Math.max(this.totalSeconds + deltaSeconds, this.remainingSeconds)
    this.emit('tick', this.snapshot())
  }

  idle () {
    this.mode = 'idle'
    this.running = false
    this.endsAt = null
    this.totalSeconds = 0
    this.pausedRemaining = 0
    this._stopTicking()
    this.emit('tick', this.snapshot())
  }

  countPomodoro () {
    this.completedPomodoros += 1
  }

  resetCycle () {
    this.completedPomodoros = 0
    this.emit('tick', this.snapshot())
  }

  _ensureTicking () {
    if (this._interval) return
    this._interval = setInterval(() => this._tick(), TICK_MS)
  }

  _stopTicking () {
    if (!this._interval) return
    clearInterval(this._interval)
    this._interval = null
  }

  _tick () {
    if (!this.running || this.mode === 'idle') return
    const remaining = this.remainingSeconds

    // Only emit once per whole second to keep IPC traffic sane, but always
    // emit the final tick.
    const whole = Math.ceil(remaining)
    if (whole !== this._lastWhole) {
      this._lastWhole = whole
      this.emit('tick', this.snapshot())
    }

    if (remaining <= 0) {
      const finished = this.mode
      this.running = false
      this._stopTicking()
      this.emit('complete', finished)
    }
  }
}

module.exports = { Timer }
