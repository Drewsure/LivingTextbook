# ADR 1372: Publisher Manifest MIME Alignment

## Status

Accepted for the first publisher intake workflow.

## Context

The source preflight classifies files by detected MIME type. The bounded
publisher manifest starter initially described accepted values as extensions,
which made a generated manifest appear valid while causing the real preflight
to reject every declared file as unsupported.

## Decision

Use MIME types in generated `acceptedTypes` arrays, keep extension checks only
for the starter's input validation, and keep the preflight detector aligned
for every supported publisher lane. Add DOCX and WEBP detection where those
extensions are already accepted by the intake contract. The starter's self-test
must generate a temporary multi-media folder and run the real preflight.

## Consequences

- A publisher can use the documented starter command and receive a manifest
  that the actual preflight understands.
- The helper and preflight have one tested type vocabulary without accepting
  arbitrary file types.
- MIME alignment remains inventory evidence only; it does not authorize
  upload, promotion, package assembly, release, QR printing, persistence, or
  student use.

## Verification

- `node --check scripts/create-publisher-source-manifest.mjs`
- `node scripts/create-publisher-source-manifest.mjs --self-test`
- `node --experimental-strip-types scripts/publisher-source-preflight.mjs --self-test`
- `npm run verify:foundation-composition`
