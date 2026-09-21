# Build Session: Target-Language Policy Contract

## Completed

- Added a shared target-language policy contract.
- Added a Japanese-target white-label tenant fixture.
- Added deterministic checks for target-language audio, support-language
  progress blocking, and Japanese-aware segmentation.
- Preserved the existing Japanese pilot blockers for furigana, curriculum
  review, audio approval, and language-aware game input.

## Verification intent

This slice proves that Japanese can be configured as a true learning target
without changing MiniStar English behavior. It does not promote Japanese
content, enable student routes, or replace the current English target-language
fixtures.

## Next gate

Create a reviewed Japanese unit fixture only after the language-aware
segmentation and target-language audio evidence contracts are ready.

Recorded in ADR 0932 and decision register DR-1004.
