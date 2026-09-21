# Build Session: Content Package Target-Language Binding

## Completed

- Added optional package metadata for target language, assist languages, and
  target-language policy.
- Validated package policy scope through the shared content model.
- Added runtime rejection when a package target language differs from the
  requested runtime target language.
- Added runtime coverage for support-language progress tampering.

## Boundary preserved

This slice does not make the Japanese pilot ready. Furigana, Japanese-aware
game tokenization, reviewed Japanese curriculum, and target-language audio
evidence remain required before activation.

Recorded in ADR 0933 and decision register DR-1005.
