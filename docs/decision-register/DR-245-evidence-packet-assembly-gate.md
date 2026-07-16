# DR-245 Evidence Packet Assembly Gate

Date: 2026-07-16

## Decision

Evidence packets must pass a review-only assembly gate before packet version freeze, approval, export, route promotion, QR promotion, local bundle activation, storage write, or student assignment can exist.

## Rationale

The platform needs a clean reviewer view that joins upload, Labelled Diagram, media, and release-control evidence. This protects the white-label product from accidental live workflows while still making partner pilot readiness concrete and understandable.

## Guardrails

- No packet version freeze.
- No approval capture.
- No release state mutation.
- No student assignment.
- No export generation.
- No QR promotion.
- No route promotion.
- No local bundle activation.
- No storage write.
- No evidence download.

## Verification

- `npm run verify:upload-channels`
- `npm run verify:foundation`
