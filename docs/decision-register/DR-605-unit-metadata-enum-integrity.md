# DR-605: Unit Metadata Catalog Integrity

Status: Accepted

Decision: Validate unit game mode, game family, and parent engine identifiers against the shared curated catalogs before runtime consumers interpret a unit.

Rationale:

- Runtime JSON bypasses TypeScript's compile-time protection.
- Unknown identifiers can route content to an undefined or incompatible engine.
- Silent fallback would weaken review evidence and white-label integration safety.

Guardrails:

- Supported game modes, families, and parent engines are checked explicitly.
- Unknown values remain review blockers and are not automatically remapped.
- New values require catalog, compatibility, and regression updates.
- No provider, storage, playback, release, assignment, or student-state side effect is introduced.
