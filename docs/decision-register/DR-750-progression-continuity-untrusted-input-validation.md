# DR-750: Progression Continuity Untrusted Input Validation

Progression continuity runtime requests now validate expected identity fields
as non-blank strings before comparison. Malformed external callers receive a
deterministic validation error instead of a string-method exception. The
review-only adapter remains unable to mutate routes, unlocks, scoring, Star
Dust, rewards, or persistence.

See ADR 0678 and `docs/PROGRESSION_CONTINUITY_CONTRACT.md`.
