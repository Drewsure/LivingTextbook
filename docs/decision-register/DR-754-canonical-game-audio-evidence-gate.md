# DR-754: Canonical Game Audio Evidence Gate

Decision: The shared canonical game validator now requires at least one
`audio_requested` event before a game attempt can be accepted as complete.

This makes the platform-wide audio rule enforceable at runtime. The event is
support evidence only: it cannot unlock progress, grant mastery, award Star
Dust, or replace target-language answer activity. Existing canonical game
slices already satisfy the rule through `createAudioRequestedEvent`.

See ADR 0682 and `docs/CANONICAL_GAME_INTEGRATION_STANDARD.md`.
