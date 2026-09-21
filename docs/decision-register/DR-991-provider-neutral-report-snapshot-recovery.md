# DR-991: Provider-Neutral Report Snapshot Recovery

Decision: add a deterministic, provider-neutral recovery packet and a
review-only adapter for teacher report-package snapshots. Hosted-managed and
local-classroom deployments may be rehearsed through the same contract, but
no backup, restore, export, or provider write is authorized in foundation
mode.

Required invariants:

- The packet preserves snapshot tenant, package, launch, and deployment scope.
- The packet fingerprint must match its embedded sanitized snapshot.
- Raw event records, learner audio, transcripts, and real learner identifiers
  remain excluded.
- `restoreAllowed`, `exportAllowed`, and `writesAllowed` remain false.
- Invalid packets fail closed; valid packets still return `allowed: false` and
  `sideEffect: "none"` until the separate provider and policy gates are
  approved.

Evidence: `docs/adr/0919-provider-neutral-report-snapshot-recovery.md`,
`packages/content-model/src/teacherReportPackageSnapshotRuntime.ts`, and
`scripts/verify-teacher-report-package-snapshot-runtime.mjs`.

