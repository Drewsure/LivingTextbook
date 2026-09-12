# DR-745: Curated Offer Map Contract Validation

Curated game offer maps now validate tenant scope, unique game modes, parent
family, parent engine, ready-route presence, and required audio/reporting
metadata against the shared game-mode contract. The sample Flashcards offer
was corrected from `pairing` to the canonical `selection` engine.

The review surface exposes `Map valid` or `Needs review` without publishing,
assigning, or mutating package data. See ADR 0673.
