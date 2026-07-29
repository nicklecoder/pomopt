'use strict'

const { BY_ID } = require('../shared/exercises')

/**
 * Tracks where we are inside a break's exercise sequence.
 *
 * Position is derived from the break timer's elapsed seconds (plus any time
 * the user skipped past), so pausing the break pauses the sequence for free
 * and there is no second clock to drift.
 */
class BreakSession {
  constructor (kind, plan, totalSeconds) {
    this.kind = kind
    this.exercises = plan.exercises
    this.segments = plan.segments
    this.totalSeconds = totalSeconds
    this.skipOffset = 0
    this.completedSegments = new Set()
    this.skippedSegments = new Set()

    // Precompute cumulative start offsets.
    let acc = 0
    this.offsets = this.segments.map((s) => {
      const start = acc
      acc += s.seconds
      return start
    })
    this.sequenceSeconds = acc
  }

  _position (elapsed) {
    const t = elapsed + this.skipOffset
    for (let i = 0; i < this.segments.length; i++) {
      const start = this.offsets[i]
      const end = start + this.segments[i].seconds
      if (t < end) {
        return {
          index: i,
          segment: this.segments[i],
          segmentElapsed: Math.max(0, t - start),
          segmentRemaining: Math.max(0, end - t)
        }
      }
    }
    return null // sequence finished; free time until the break clock runs out
  }

  /** Jump to the start of the next segment. */
  skipSegment (elapsed) {
    const pos = this._position(elapsed)
    if (!pos) return
    // Jumping past an exercise must not log it as done.
    if (pos.segment.type === 'exercise') this.skippedSegments.add(pos.index)
    this.skipOffset += pos.segmentRemaining
  }

  /** Jump back to the start of the current segment, or the previous one. */
  previousSegment (elapsed) {
    if (this.segments.length === 0) return
    const pos = this._position(elapsed)
    if (!pos) {
      // In free time — go back to the last segment.
      const t = elapsed + this.skipOffset
      this.skipOffset -= t - this.offsets[this.segments.length - 1]
      return
    }
    if (pos.segmentElapsed > 2) {
      this.skipOffset -= pos.segmentElapsed // restart current
    } else if (pos.index > 0) {
      this.skipOffset -= pos.segmentElapsed + this.segments[pos.index - 1].seconds
    }
  }

  /**
   * Mark every exercise segment we have now moved past as done, and return
   * the ids that were newly completed.
   */
  harvestCompleted (elapsed) {
    const t = elapsed + this.skipOffset
    const done = []
    for (let i = 0; i < this.segments.length; i++) {
      const seg = this.segments[i]
      if (seg.type !== 'exercise') continue
      if (this.completedSegments.has(i)) continue
      if (t >= this.offsets[i] + seg.seconds) {
        this.completedSegments.add(i)
        if (!this.skippedSegments.has(i)) done.push(seg.exerciseId)
      }
    }
    return done
  }

  /** The payload the break window renders. */
  view (timerSnapshot) {
    const elapsed = timerSnapshot.elapsedSeconds
    const pos = this._position(elapsed)

    const base = {
      kind: this.kind,
      running: timerSnapshot.running,
      breakRemaining: timerSnapshot.remainingSeconds,
      breakTotal: this.totalSeconds,
      exerciseCount: this.exercises.length,
      completedCount: new Set(
        [...this.completedSegments]
          .filter((i) => !this.skippedSegments.has(i))
          .map((i) => this.segments[i].exerciseId)
      ).size
    }

    if (!pos) {
      return {
        ...base,
        phase: 'free',
        exercise: null,
        side: null,
        segmentRemaining: timerSnapshot.remainingSeconds,
        segmentTotal: timerSnapshot.remainingSeconds,
        exerciseIndex: this.exercises.length,
        nextExercise: null
      }
    }

    const seg = pos.segment
    const ex = BY_ID.get(seg.exerciseId)
    return {
      ...base,
      phase: seg.type, // 'transition' | 'switch' | 'exercise'
      exercise: ex ? { ...ex } : null,
      side: seg.side || null,
      segmentRemaining: pos.segmentRemaining,
      segmentTotal: seg.seconds,
      exerciseIndex: seg.exerciseIndex,
      nextExercise: null
    }
  }
}

module.exports = { BreakSession }
