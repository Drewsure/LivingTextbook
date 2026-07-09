# DR-070: Game Mode Audio Coverage

## Decision

Declare per-game audio support for Quiz and Sentence Builder in both MiniStar and sample publisher content packages.

## Rationale

Audio support is a foundational requirement, especially for young learners and learners who cannot yet read English fluently. New game routes should not be treated as ready unless their package-level audio coverage is explicit.

## Consequences

- Content packages now list active mode audio coverage more honestly.
- Future student-facing modes must update `gameModeAudioCueIds`.
- Production packages still need reviewed audio source decisions.

## Non-Goals

- Production recorded voice files.
- Autoplay behavior.
- Cloud speech scoring.
