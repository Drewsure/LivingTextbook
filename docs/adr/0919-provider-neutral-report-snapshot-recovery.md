# ADR 0919: Provider-Neutral Report Snapshot Recovery

## Status

Accepted for foundation review; live activation remains blocked.

## Decision

Use one provider-neutral recovery packet for teacher report-package snapshots
across `hosted-managed` and `local-classroom` deployments. The packet carries
the sanitized snapshot, source and target deployment modes, a deterministic
fingerprint, and explicit privacy exclusions. A review-only adapter validates
the packet and reports readiness, but never creates a backup, restores data,
exports an archive, or writes to a provider.

## Rationale

The platform must support both saleable hosted tenants and closed school/local
deployments without creating two incompatible report contracts. A stable
fingerprint makes tampering and drift visible during review. Keeping the
adapter review-only preserves the current safety boundary while provider,
retention, school-policy, encryption, and release gates remain unfinished.

## Required Invariants

- Snapshot scope remains tenant, package, and launch bound.
- Hosted-managed and local-classroom modes use the same snapshot shape.
- Recovery packets contain no raw event records, learner audio, transcripts, or
  real learner identifiers.
- `restoreAllowed`, `exportAllowed`, and `writesAllowed` remain false.
- A fingerprint mismatch fails validation.
- Backup and restore rehearsal requires a valid recovery packet but still
  returns `allowed: false` and `sideEffect: "none"`.

## Evidence

- `packages/content-model/src/teacherReportPackageSnapshotRuntime.ts`
- `scripts/verify-teacher-report-package-snapshot-runtime.mjs`
- `scripts/verify-runtime-behavior.mjs`

