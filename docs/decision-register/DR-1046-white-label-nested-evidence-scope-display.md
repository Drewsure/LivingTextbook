# DR-1046: White-label Nested Evidence Scope Display

Decision: display tenant and package scope in the package, pilot, and
release-control evidence cards.

Required invariants:

- Package evidence exposes its tenant and package scope.
- Pilot evidence exposes its tenant and package scope.
- Release-control evidence exposes its tenant and package scope.
- Nested evidence remains review-only and cannot activate release actions.

Evidence: `apps/web/src/features/release/WhiteLabelReleaseReadinessPanel.tsx`,
`packages/content-model/src/whiteLabelReleaseReadiness.ts`, and
`docs/WHITE_LABEL_RELEASE_READINESS_STANDARD.md`.
