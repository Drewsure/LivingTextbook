# DR-039: Backend Decision Matrix Before Vendor Choice

Date: 2026-07-03

## Decision

Add a backend decision matrix before selecting a production storage vendor. The matrix compares backend patterns by cost, white-label fit, pilot readiness, deployment compatibility, and forbidden storage behavior.

## Rationale

The platform needs durable route registry, reviewed content package, launch session, roster, progress event, media manifest, and report policy records. Choosing a vendor too early could lock the product into hosted-only assumptions, weaken local/closed deployment options, or increase cost before the pilot scope is proven.

## Consequences

- `/teacher/intake` now shows a backend matrix before the detailed persistence boundary panels.
- Hosted managed database pattern is the recommended first pilot direction, but no vendor is chosen yet.
- Static demo data remains acceptable for demos only.
- Local/closed storage remains in scope but deferred as a first pilot cost center unless required by the partner.
- Raw learner audio, transcripts, ungated exports, and AI Tutor transcript storage remain outside the core pilot.

## Files

- `apps/web/src/data/sampleBackendDecisionMatrix.ts`
- `apps/web/src/features/persistence/BackendDecisionMatrixPanel.tsx`
- `docs/BACKEND_DECISION_MATRIX.md`
- `docs/verification/BACKEND_DECISION_MATRIX_CHECKS.md`
