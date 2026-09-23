# ADR 1112: Deployment Handoff Identity Reconciliation

## Decision

Require the commercial deployment handoff to carry explicit release-readiness
tenant and package identities and reconcile them against the deployment
decision before the packet is considered internally valid.

## Rationale

An opaque readiness ID or display label is not sufficient evidence of scope.
Explicit identity fields make cross-tenant and cross-package drift observable
and prevent a review packet from presenting unrelated evidence as a coherent
commercial path.

## Consequences

- Every hosted, local, and packaged artifact inherits identity mismatch
  blockers.
- The check remains provider-neutral and review-only.
- Persistence, installation, promotion, QR mutation, and student launch stay
  disabled regardless of the identity result.

## Verification

- `node scripts/verify-runtime-behavior.mjs`
- `npm run verify:routes`
- Full foundation verification before publication.
