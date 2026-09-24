# ADR 1153: Local Export and Rollback Storage Identity

Status: Accepted for the review-only foundation runtime

## Decision

Local export/retention dry runs and package-manifest rollback dry runs must
carry the exact storage-selection preflight and evidence-storage gate
identities that govern the local recovery packet.

Both previews remain blocked and side-effect free. Storage identity is
evidence lineage, not authorization to export, delete, copy, write, mutate a
QR route, or execute rollback.

## Rationale

Export, retention, and rollback are the operations most likely to be reused by
future local companion tooling. Their preview records must not become a side
door around the approved storage decision or the recovery packet.

## Consequences

- Local backup, export, retention, and rollback evidence remains traceable to
  one storage review decision.
- Missing or enabled storage identity fails validation before future tooling is
  authorized.
- Learner data, raw audio, credentials, package writes, route mutation, and
  rollback execution remain blocked.

## References

- `packages/content-model/src/localBundleExportRetentionDryRun.ts`
- `packages/content-model/src/localBundlePackageManifestRollbackDryRun.ts`
- `docs/adr/1152-local-recovery-storage-identity.md`
