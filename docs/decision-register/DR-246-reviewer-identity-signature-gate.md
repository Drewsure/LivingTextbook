# DR-246 Reviewer Identity And Signature Gate

Date: 2026-07-16

## Decision

Signed approval capture must remain blocked until reviewer identity, approval intent, signature policy, audit retention, evidence attachment, revocation, and release-control rules are defined.

## Rationale

The product is becoming a white-label platform for schools and publishers. A casual approve button would create risk around who approved, what they approved, whether evidence was missing, whether signatures can be revoked, and whether local deployments can preserve audit proof.

## Guardrails

- No signed approval capture.
- No approve button.
- No release-state mutation.
- No packet version freeze.
- No audit record write.
- No signature attachment upload.
- No signed PDF packet.
- No evidence download.
- No student assignment from approval.

## Verification

- `npm run verify:upload-channels`
- `npm run verify:foundation`
