# ADR 1154: Local Media Evidence Storage Identity

Status: Accepted for the review-only foundation runtime

## Decision

Local media evidence bindings and media-manifest reconciliations must carry the
exact storage-selection preflight and evidence-storage gate identities used by
local recovery and package rollback previews.

Storage drift is a mismatch. Media evidence remains diagnostic and cannot
authorize copying, package writes, downloads, activation, QR mutation, or
student-facing promotion.

## Rationale

Media is the most likely local-bundle surface to bypass a package storage
decision because it has independent rights, checksum, accessibility, and path
evidence. Binding the same storage identity keeps each asset traceable to one
review decision.

## Consequences

- A complete media evidence packet cannot appear aligned against the wrong
  storage decision.
- Storage remains provider-neutral, blocked, and disallowed.
- No media bytes, learner data, or credentials are copied or persisted.

## References

- `packages/content-model/src/localBundleMediaEvidenceBinding.ts`
- `packages/content-model/src/localBundleMediaManifestReconciliation.ts`
- `docs/adr/1153-local-export-rollback-storage-identity.md`
