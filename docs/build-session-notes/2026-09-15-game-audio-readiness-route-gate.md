# Build Session: Game Audio Readiness Route Gate

## Outcome

The canonical game shell now enforces the existing audio-first learning rule
at the gameplay boundary. It checks target-language coverage for every unit
term, every target sentence, and one instruction cue scoped to the selected
game mode. Complete sample packages remain playable; incomplete packages are
paused before a game can emit scoring or completion evidence.

## Verification

- Runtime behavior asserts both complete and incomplete coverage.
- The learning-audio card reports coverage and missing content.
- The access gate distinguishes audio review from entry practice and level
  availability.
- The change remains white-label and content-driven; no MiniStar-specific
  assumption was added.

## Boundary

No upload, live AI, persistence, or Phaser promotion was enabled. This slice
hardens the shared route and content contracts before canonical game expansion.
