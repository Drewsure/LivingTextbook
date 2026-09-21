# DR-994: Reporting Workbench Recovery Coverage

Decision: show report snapshot recovery rehearsal evidence for MiniStar and
the sample publisher on the teacher reporting workbench. Resolve each context
independently and keep execution blocked.

Required invariants:

- Tenant, package, and launch identity remain independently resolved.
- Both tenants use the same hosted/local snapshot contract.
- Export, backup, restore, provider writes, and progression mutation remain
  blocked.
- Raw events, learner audio, transcripts, and real learner identifiers remain
  excluded.

Evidence: `docs/adr/0922-reporting-workbench-recovery-coverage.md`,
`apps/web/src/app/teacher/reporting/page.tsx`, and
`scripts/verify-active-routes.mjs`.

