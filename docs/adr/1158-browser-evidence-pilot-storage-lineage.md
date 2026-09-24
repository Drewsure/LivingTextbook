# ADR 1158: Browser Evidence Pilot Storage Lineage

Status: Accepted for the review-only foundation runtime

## Decision

Composite browser, privacy, and tenant-isolation evidence bindings must carry
the canonical storage-selection preflight and evidence-storage gate identity.
The release binding must preserve both identities into release review.

## Rationale

Browser evidence is close to pilot approval, so it must not become a second
lineage. The same storage policy decision must remain visible from pilot
review through release review, even while storage activation is blocked.

## Consequences

- A stale storage preflight or gate fails validation rather than becoming a
  warning.
- Browser evidence remains provider-neutral and review-only.
- Pilot launch, hosted writes, student data collection, package promotion,
  production approval, and release mutation remain blocked.

## References

- `packages/content-model/src/browserPrivacyTenantEvidencePilotBinding.ts`
- `packages/content-model/src/browserPrivacyTenantEvidenceReleaseBinding.ts`
- `scripts/verify-browser-privacy-tenant-evidence-pilot-binding.mjs`
- `scripts/verify-browser-privacy-tenant-evidence-release-binding.mjs`
