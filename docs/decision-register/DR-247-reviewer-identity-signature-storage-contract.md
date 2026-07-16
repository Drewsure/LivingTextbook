# DR-247 Reviewer Identity And Signature Storage Contract

Date: 2026-07-16

## Decision

Reviewer identity and signature readiness must have a durable backend-neutral record contract before signed approval capture or approval-driven release workflow exists.

## Rationale

White-label tenants may choose different approval models. The platform still needs one contract for who approved, what they approved, which evidence packet version they referenced, what signature policy applied, how revocation works, and why approval cannot create assignments or release state alone.

## Guardrails

- No signed approval capture.
- No approve button.
- No release-state mutation.
- No signature attachment upload.
- No signed PDF packet.
- No evidence download.
- No approval-driven student assignment.
- No backend vendor selection.

## Verification

- `npm run verify:backend-storage`
- `npm run verify:foundation`
