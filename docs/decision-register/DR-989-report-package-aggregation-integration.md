# DR-989: Report Package Aggregation Integration

Decision: place the bounded teacher launch report aggregation on the report
package preview route, using the resolved tenant and content-package identity.

Required invariants:

- Static rehearsal and live review evidence remain visibly distinct.
- Existing teacher operations authorization is reused; no second access path is
  introduced.
- Preview remains read-only, export-blocked, privacy-safe, and launch-scoped.
- Both MiniStar and sample publisher report-package routes must pass the active
  route verification gate.

Evidence: `docs/adr/0917-report-package-aggregation-integration.md`,
`apps/web/src/app/teacher/sessions/[launchCode]/report-package/page.tsx`, and
`scripts/verify-active-routes.mjs`.
