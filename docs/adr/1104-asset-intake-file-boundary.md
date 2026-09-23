# ADR 1104: Asset Intake File Boundary

Status: Accepted for the review-only foundation runtime

## Decision

The shared asset runtime validates MIME compatibility and byte length before a
future upload or storage provider can be considered. Supported asset kinds are
image, audio, video, font, and source-document. Each kind has an explicit MIME
allowlist. Byte length must be a positive integer and must not exceed 256 MiB.

Tenant policy may impose a stricter size budget. MIME and size validation remain
separate from checksum, malware scan, rights, target mapping, release, and
student-facing gates.

## Rationale

Asset channels will eventually carry textbook images, audio, music, video,
fonts, and source documents. Extension-only checks or unrestricted MIME and
size fields would make future providers ambiguous and increase storage and
security risk. A provider-neutral boundary is cheaper to test and easier for
white-label tenants to tighten than provider-specific rules scattered through
teacher screens or routes.

## Consequences

- Review requests become precise enough for later upload adapters.
- Tenant policies can be stricter without changing the shared contract.
- No live upload, storage write, transcode, promotion, or learner upload is
  introduced by this decision.
- Future provider work must preserve this validation before any side effect.

## References

- `packages/content-model/src/assetRuntime.ts`
- `scripts/verify-runtime-behavior.mjs`
- `docs/verification/CONTENT_INTAKE_CHECKS.md`
