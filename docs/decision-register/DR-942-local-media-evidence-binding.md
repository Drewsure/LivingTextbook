# DR-942: Local Media Evidence Binding

## Decision

Use a tenant- and package-version-scoped media evidence binding before local
media is copied, activated, or promoted.

## Required Invariants

- Rights, checksum, scan, target mapping, and local eligibility are explicit.
- Audio has transcript evidence; video has captions/transcript and poster;
  images have an explicit alt-text state.
- Review-stage missing evidence remains blocked, not silently approved.
- Paths are safe and all upload, copy, write, activation, promotion, and QR
  mutation actions remain blocked with no side effect.

## Evidence

- `packages/content-model/src/localBundleMediaEvidenceBinding.ts`
- `apps/web/src/data/sampleLocalBundleMediaEvidenceBinding.ts`
- `apps/web/src/features/persistence/LocalBundleMediaEvidenceBindingPanel.tsx`
- `scripts/verify-local-bundle-media-evidence-binding.mjs`
