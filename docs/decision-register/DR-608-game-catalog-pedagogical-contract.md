# DR-608: Game Catalog Pedagogical Contract

Status: Accepted

Decision: Validate each catalog item's identity, two-sentence requirement, term-range bounds, and supported-level list in the existing game-mode verifier.

Rationale:

- Catalog metadata drives reviewed pathways and is not merely presentation data.
- Invalid ranges or level lists can make activity availability misleading.
- The canonical unit contract requires exactly two target sentence structures.

Guardrails:

- IDs must match catalog keys.
- Sentence count must be exactly 2.
- Term ranges must be ordered and within 1–12.
- Levels must be non-empty, unique, ascending, and within 1–8.
- No provider, storage, playback, release, assignment, or student-state side effect is introduced.
