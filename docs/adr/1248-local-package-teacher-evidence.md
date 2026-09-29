# ADR 1248: Local Package Teacher Evidence

## Status

Accepted for the first white-label pilot vertical slice.

## Decision

Use one deterministic package/unit launch identity across the local front
door, canonical games, multimedia routes, and teacher evidence route. The
teacher route reuses `TeacherSessionLocalEvidencePanel` and reads the same
validated browser rehearsal record produced by the student routes.

## Consequences

- A teacher can inspect the actual local student journey instead of only a
  pre-seeded sample report.
- Cross-route media and game evidence can be joined without a hosted database.
- The route remains useful for closed-local rehearsal while persistence,
  export, roster, and school-policy decisions remain separate.
- Changing the session identity in one local route will fail the foundation
  verifier rather than silently splitting the report.

## Verification

`scripts/verify-local-pilot-teacher-evidence-route.mjs` checks the shared
identity helper, package content gate, local evidence panel, and forbidden
sample/side-effect paths. Foundation composition runs that verifier.
