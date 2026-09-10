# DR-606: Unit Mode Compatibility

Status: Accepted

Decision: Validate each unit's game mode against its declared game family, parent engine, and supported curriculum levels using a shared content-model compatibility contract.

Rationale:

- Valid enum values can still describe an impossible routing combination.
- Engine, pedagogy, audio, scoring, and level range form one pathway boundary.
- Silent inference would allow imported or AI-authored packages to drift from the curated catalog.

Guardrails:

- Every supported mode has one family, one parent engine, and explicit supported levels.
- Mismatches remain review blockers.
- Changes require compatibility, route, audio, scoring, and regression review.
- No provider, storage, playback, release, assignment, or student-state side effect is introduced.
