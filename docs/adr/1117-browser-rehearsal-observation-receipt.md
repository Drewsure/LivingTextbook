# ADR 1117: Browser Rehearsal Observation Receipt

## Decision

Represent stronger browser evidence with a structured, tenant/package/session-
bound observation receipt. Human-observed receipts require a teacher reviewer;
automated receipts require an automation reviewer.

## Rationale

The release-readiness packet must distinguish coded rehearsal from evidence
that a teacher or browser automation actually observed the routes. A structured
receipt makes scope, reviewer role, timestamp, and blocked side effects
auditable without creating a live release workflow.

## Consequences

- Future evidence can be adjudicated without changing the core package shape.
- Tenant, package, launch, unit, and student-session drift is rejected.
- Duplicate routes and missing checks are rejected.
- Promotion, persistence, export, approval, QR mutation, assignment, and
  student launch remain disabled.

## Verification

- `node scripts/verify-browser-rehearsal-observation.mjs`
- `npm run typecheck --workspace @living-textbook/web`
- Full foundation verification before publication.
