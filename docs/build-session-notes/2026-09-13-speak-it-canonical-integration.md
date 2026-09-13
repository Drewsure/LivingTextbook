# Build Session: Speak It Canonical Integration

## Completed

- Added canonical `game_started` emission with a deterministic replay seed.
- Added shared audio-request events for the Speak It instruction and every
  target prompt.
- Added replay evidence to speech interactions and completion metadata.
- Added Speak It to the canonical integration verifier.
- Preserved teacher-approved local microphone record/replay with no upload,
  transcript, AI scoring, or reward shortcut.
- Mounted Speak It in the student launch and coded front-door flows.
- Added the shared tenant-aware microphone approval hook so all speaking
  surfaces use the same teacher decision.
- Added `microphone_practice` as a support-only event and stopped using
  `round_shown` for recorder-control activity.
- Corrected the teacher sequence and speech requirement status copy so the
  documentation matches the canonical launch integration.

## Verification target

Run the canonical game verifier, web typecheck, full foundation suite, and
active route checks. Complete the core self-confirmed speech path without a
contract diagnostic.

## Not promoted

No Phaser or frozen Z.ai source was imported. No live persistence, assignment
activation, report export, or AI Tutor behavior was enabled.
