# DR-992: Report Snapshot Recovery Review Surface

Decision: expose the shared provider-neutral report snapshot recovery
rehearsal on both the persistence workbench and the tenant-aware report
package preview. Keep the surfaces read-only and clearly separate evidence
validity from execution permission.

Required invariants:

- The snapshot is resolved from the tenant/package/launch monitor context.
- Hosted-managed and closed-local packet checks use the same contract.
- No backup, restore, export, provider write, or activation control is added.
- The review surface does not render raw event records, learner audio,
  transcripts, or real learner identifiers.

Evidence: `docs/adr/0920-report-snapshot-recovery-review-surface.md`,
`apps/web/src/features/persistence/TeacherReportSnapshotRecoveryRehearsalPanel.tsx`,
and `scripts/verify-report-runtime.mjs`.

