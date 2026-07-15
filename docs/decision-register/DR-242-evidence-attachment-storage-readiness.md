# DR-242 Evidence Attachment Storage Readiness

Date: 2026-07-15

## Decision

The platform will treat evidence attachments as storage-policy-gated records before any upload, download, signature, or release-control behavior exists.

## Rationale

Evidence packets will eventually need supporting files, but live file storage is a major white-label and local-deployment boundary. Hosted object storage, closed local folders, and hybrid export archives have different cost, privacy, backup, and school-policy implications. Exposing the candidates now keeps the architecture honest without enabling risky behavior.

## Guardrails

- No evidence file upload.
- No object storage write.
- No local folder write.
- No attachment download.
- No signed approval attachment.
- No release-state mutation.
- No student-facing attachment.

## Verification

- `npm run verify:upload-channels`
- `npm run verify:foundation`
