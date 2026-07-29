# PomoPT

A pomodoro timer that spends your breaks on your body.

Built around one problem: hyperfocus. A timer you can dismiss with a click is a
timer you will dismiss. So when a break starts, PomoPT takes over every screen
you own, tells you exactly which exercise to do, counts you through it, and does
not give the screen back until the break is over.

## Packs, groups, profiles

**94 exercises across 7 packs.** Each pack splits into groups you can toggle
independently — run Upper body but only its pull work, or keep the whole knee
program on while everything else is off.

| Pack | Groups |
| --- | --- |
| Knee PT (24) | hyperextension · out-toeing · mobility · circulation |
| Upper body (18) | push · pull · shoulders · arms |
| Core (11) | anti-extension · flexion · rotation · lower back |
| Lower body (10) | squat · hinge · lunge · calves |
| Stretching (14) | hips · hamstrings · chest/shoulders · spine · neck/forearms |
| Cardio (7) | bike · bodyweight |
| Yoga (10) | flows · balance · restorative |

**Profiles are the point.** A profile is "what is available to me right now":
which equipment exists, which packs are running, an effort ceiling, and how
heavy your dumbbells go. Two ship by default:

- **Home** — everything on, effort ceiling High, dumbbells to 52.5 lb
- **Office** — desk/wall/chair/step only, Knee PT and Stretching only, effort
  ceiling **Low** so nothing can leave you sweaty before a meeting

Switch between them from the menu bar (*Where you are*) or the Timer tab, and
the entire available exercise set changes with one click. Duplicate either one
for a third — a hotel room, a week when the knee is angry.

**Nothing unavailable ever gets scheduled.** An exercise lists everything it
needs and all of it must be present. `minWeightLb` gates the loaded lifts, so
dropping your heaviest dumbbell to 30 lb quietly removes the exercises that need
more. Short breaks are further restricted to `setting: 'desk'` — anything
needing the floor, a bench, or a trip to the garage is long-break-only.

**Anchor packs** get a guaranteed slot in every break. Knee PT is an anchor by
default, and it claims one slot per enabled group (up to 2 short / 3 long) so a
break reliably covers both hyperextension *and* out-toeing rather than landing on
two of the same thing. The rehab does not get crowded out by bicep curls.

## The knee program

Two specific targets, since these are the reason the app exists:

**Knee hyperextension (genu recurvatum).** Standing with the knees locked back
loads the joint capsule and ligaments instead of muscle. The work is quad and
hamstring control through the last degrees of extension, posterior-chain
strength, and proprioception — relearning where "straight" actually is.

**Out-toeing ("duck feet").** Usually a combination of tight deep hip external
rotators, weak hip internal rotators and adductors, limited ankle dorsiflexion
(the foot turns out so the shin can travel forward), and a dropped arch. All four
get hit, plus a toes-forward calibration drill against a floorboard seam — the
actual habit retrain.

Every loaded leg exercise in the Lower body pack is cued to finish *short of a
locked knee*, and every standing yoga pose overrides the usual "straighten the
leg" instruction. Those are the two places a hyperextending knee gets rehearsed
under load.

## Diagrams

Wording is imprecise for movement — "stop just short of straight" is hard to
picture — so **every one of the 94 exercises has an animated diagram** beside its
cues. Rather than 94 drawings, there is a single parametric stick figure driven
by joint angles: each exercise declares a start and an end pose and the figure
loops between them, pausing at each end so both positions are readable. The
caption changes with the phase.

Where a side-on skeleton is the wrong camera, the exercise supplies its own draw
function instead:

- **seen from above** for feet alignment, hip rotation, band pull-aparts, flyes,
  Pallof presses, supine twists
- **seen from the front** for lateral raises, hammer curls (vertical dumbbells
  are the only way to show a neutral grip), jumping jacks, suitcase carries
- **lying down** for floor and bench work, planks, dead bugs, hollow holds
- **close-up** for short-foot and calf raises, where the ankle range *is* the
  exercise and a whole standing figure would be too small to read

Several figures deliberately draw the **wrong** shape as the first phase, because
the failure is the thing worth recognising: the plank and side plank open with
sagging hips, the suitcase carry with a shoulder tipped away from the weight, and
the soft-knee stance with the knee bowed backwards. Some angles are exaggerated
too — a true 5° knee unlock is invisible at diagram scale.

The sun salutation is a four-stage flow rather than a two-pose loop; the
keyframe helper interpolates between adjacent shapes and captions each stage.

To review them:

```sh
npx electron scripts/figure-sheet.js ./shots                    # all 94
npx electron scripts/figure-sheet.js ./shots db-rdl,tree-pose   # just these
npx electron scripts/figure-mount-test.js                       # assert all mount live
```

## Meetings

A break overlay that seizes the screen during a screen share is the worst thing
this app could do, so there are two mechanisms.

**A warning first.** Twenty seconds before a break takes over, a small panel
appears in the corner of the primary display with the countdown and three
buttons: *I'm in a meeting*, *5 min*, *Start now*. It opens without stealing
focus, and it is draggable so you can move it off a window you are sharing. A
break can therefore never appear without notice. Set the warning to 0 seconds if
you want the old behaviour.

**A hold that remembers what you owe.** *I'm in a meeting* stops everything
indefinitely — the timer goes idle and nothing can take the screen until you
resume. Reachable from:

- the menu bar (top item, and the title changes to `⏸ Hold`)
- the Timer tab
- the break overlay itself, as a **plain click** — no hold-to-confirm, because
  when a break has already landed mid-meeting you need it gone now
- **⌃⌥M** from anywhere, which is faster than finding any of the above

Releasing puts you back where you were. If a break was interrupted 30 seconds in,
you owe the remaining 4½ minutes, not a fresh five — and the exercises you did
not do are not marked as recently prescribed, so the rotation is not polluted.
If you were mid-focus-block, it resumes with its time intact.

Because a hold has no time limit, it nudges you every 20 minutes so it cannot
quietly swallow the afternoon. Explicitly starting a focus block or a break
clears the hold — those are unambiguous intent.

**Not built: automatic detection.** Zoom and Teams can be spotted by their
processes, but Google Meet in a browser cannot, and half-working detection is
worse than none — you would trust it and then get ambushed. A calendar
integration is the way to do this properly; say the word if you want it.

## Running it

```sh
npm install
npm start
```

Dependencies are already installed and `npm start` works under the Node 16 that
is first on your PATH. If you ever blow away `node_modules`, run the install
under a modern Node (`nvm use 24`) — Electron's installer wants it.

To build a distributable `.dmg`:

```sh
npm install --save-dev electron-builder
npm run dist
```

## How it behaves

- **Menu bar** shows the live countdown, the active profile, and a *Where you
  are* submenu to switch it.
- **25 / 5 / 15**, long break every 4th, all configurable.
- **Breaks start automatically.** That is the entire point; leave it on. Focus
  blocks do not auto-start, so you choose when to re-enter.
- **Break overlay** opens on every display, floats above full-screen apps, and
  keeps the display awake.
- **Ending a break early requires a hold**, not a click. Same for snoozing.
  Adjustable, including to zero if you want the friction gone. *I'm in a
  meeting* is deliberately exempt — the honest escape should be the easy one.
- **Rotation** hard-excludes anything from the last 8 prescriptions. If a pack's
  only fitting exercise is on cooldown, the slot goes to a different pack rather
  than repeating.
- **Hard sets get rest** folded into the following transition — 10s after a
  moderate exercise, 20s after a high one.
- **Sleeping the laptop pauses the timer** rather than burning your focus block.
- **Today** logs what you actually completed. Skipping an exercise does not
  count it.

Keyboard, during a break: `←` / `→` step through segments, space pauses.

State lives in `~/Library/Application Support/pomopt/pomopt-state.json`.

## Layout

```
src/
  shared/
    packs.js         pack, group and equipment catalogues
    defaults.js      default settings and the Home / Office profiles
    exercises/
      index.js       concatenates the packs, plus validate()
      knee.js  upper.js  core.js  lower.js  stretch.js  cardio.js  yoga.js
  main/
    index.js         orchestration: phases, IPC, lifecycle
    timer.js         wall-clock phase timer
    scheduler.js     profile-aware exercise selection and segment planning
    breakSession.js  tracks position within a break's sequence
    store.js         settings, profiles and the daily log
    windows.js       main window and per-display break overlays
    tray.js          menu bar countdown and profile switcher
    preload.js       context-isolated IPC bridge
  renderer/
    main/            timer, today, exercise library, settings
    warning/         the pre-break corner panel
    break/
      break.*        the full-screen break overlay
      figures.js     the drawing kit: skeleton, props, render loop, knee poses
      figures-poses.js  poses for the strength, stretch, cardio and yoga packs
scripts/
  _harness.js        isolates userData per run so tests cannot contaminate
  screenshot.js      capture each screen to PNG
  figure-sheet.js    render diagrams at every pose as a contact sheet
  figure-mount-test.js  assert all 94 figures mount live in the overlay
  profile-test.js    assert profiles gate what gets scheduled
  overlay-test.js    assert overlay lifecycle and exercise logging
  hold-test.js       assert the meeting hold and pre-break warning
  cycle-test.js      run several work/break cycles at seconds per phase
```

Dev helpers: `POMOPT_DEV=1` renders break overlays as ordinary windows on the
primary display only, so you can work on the break UI without the app seizing
your screen. `POMOPT_DEV_BREAK=short|long` jumps straight into a break at launch.

```sh
POMOPT_DEV=1 POMOPT_DEV_BREAK=short npm start
npx electron scripts/profile-test.js
npx electron scripts/overlay-test.js
npx electron scripts/hold-test.js
npx electron scripts/figure-sheet.js ./shots                    # all diagrams
npx electron scripts/figure-sheet.js ./shots db-rdl,tree-pose   # just these
```

`scripts/_harness.js` exists because `electron scripts/foo.js` makes Electron
treat `scripts/` as the app root, which resolves userData to a directory shared
with every other Electron app — and with previous runs of these scripts. Each
run now gets a throwaway directory instead.

## A caveat worth reading

These are general exercises. This is not medical advice and the app knows neither
your diagnosis nor your training history. Run the knee program past your
physical therapist — the Exercises tab lists all of it in one place, filtered by
what the current profile can reach — and stop anything that hurts.

The loaded lifts assume you already know roughly what you are doing with a
dumbbell. PomoPT will not tell you your form is wrong; it only tells you what to
attempt.
