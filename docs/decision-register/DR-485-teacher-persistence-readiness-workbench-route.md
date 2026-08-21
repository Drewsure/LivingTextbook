# DR-485: Teacher Persistence Readiness Workbench Route

Date: 2026-08-21

## Decision

Add `/teacher/persistence` as a focused review-only route for backend decision, local companion storage, schema, migration, boundary, and adapter-readiness planning.

## Rationale

Persistence decisions affect white-label saleability, local textbook deployments, upload costs, teacher reports, learner data, media rights, release rollback, and future game/prototype integration. Keeping this material only inside `/teacher/intake` makes it hard to review. A dedicated workbench improves focus without selecting a vendor or enabling writes.

## Implementation

- Added `apps/web/src/app/teacher/persistence/page.tsx`.
- Linked the route from the app shell and teacher launch page.
- Added the route to the active route list, route contracts, route matrix, and route verifier.
- Kept the route review-only with no backend vendor selection and no live storage writes.

## Guardrails

- No storage vendor is selected.
- No upload, report export, student progress, local bundle, package writer, or prototype integration storage write is enabled.
- Hosted/local parity, target-language-only progress, no raw microphone audio, transcript limits, export/retention policy, and school approval remain required.

