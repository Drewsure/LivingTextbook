# ADR 1114: White-Label Verification Run Lineage

## Decision

Require every white-label release-readiness packet to carry a non-empty
verification run identifier and verification revision.

## Rationale

Quality evidence is time-sensitive. A packet that says typecheck, build,
routes, privacy, and tenant isolation passed must also say which bounded run
and revision produced that observation. This makes stale review evidence
visible without pretending that the packet itself is a release workflow.

## Consequences

- Reviewers can identify the verification snapshot under discussion.
- Sample packets must be refreshed when their source evidence changes.
- Missing lineage fails validation.
- Release, persistence, export, installation, provider activation, QR
  mutation, and student launch remain disabled.

## Verification

- `node scripts/verify-white-label-release-readiness.mjs`
- `node scripts/verify-white-label-release-readiness-behavior.mjs`
- `npm run verify:runtime-behavior`
- Full foundation verification before publication.
