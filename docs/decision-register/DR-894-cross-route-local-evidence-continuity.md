# DR-894: Cross-Route Local Evidence Continuity

## Decision

Use a single browser-rehearsal evidence record per launch, bound to the
content package and student session. Standalone canonical routes append their
route-local events through a validated, exact-deduplicating helper.

## Why

The route handoff already protects progression identity, but teacher review
also needs one coherent local event history across Flashcards, Memory Match,
and Sentence Builder. The append contract provides that continuity without
quietly introducing hosted persistence.

## Guardrails

- Package, tenant, unit, launch, and student-session mismatch: reject.
- Raw audio, transcripts, and support-language-only evidence: excluded.
- Hosted persistence, live classroom reporting, and export: still blocked.
- Evidence failure: visible warning only; never an unlock or mastery trigger.

See ADR 0822 and
`docs/verification/LOCAL_SESSION_EVIDENCE_CONTINUITY_CHECKS.md`.
