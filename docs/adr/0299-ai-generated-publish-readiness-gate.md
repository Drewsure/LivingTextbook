# ADR 0299: AI Generated Publish Readiness Gate

Status: Accepted  
Date: 2026-07-31

## Decision

Add an `ai_generated_publish_readiness_gate` preview to the teacher AI generator route.

The gate gathers correction queue clearance, verifier packet approval, manifest completeness, reward readiness, release-control binding, and teacher approval ledger capture before any generated package can become a student-facing route.

## Rationale

The generator already shows draft payload validation, correction, audio, engine, verifier, manifest, and reward readiness. A teacher/admin still needs one last-mile checklist that explains why a generated package cannot yet create launch routes, playlists, assignments, local bundles, or student-ready markers.

## Consequences

- `/teacher/generator/sample-publisher` now shows publish readiness as a review-only gate.
- Review and correction work is allowed in concept, but generated route creation remains blocked.
- Route registry writes, media playlist writes, assignment creation, local bundle writes, and student-ready markers remain blocked.
- The gate is verified by `npm run verify:ai-generator` and active route checks.
