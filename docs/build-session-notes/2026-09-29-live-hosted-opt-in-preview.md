# Build Session: Live Hosted Opt-In Preview

## Outcome

Hosted and hybrid delivery selections now produce a dynamic review-only opt-in
preview in the live package-readiness response. The preview is bound to the
actual quarantine, package, review packet, and source checksum.

## Safety boundary

The preview remains blocked and side-effect-free. It does not capture human
opt-in, select a provider, store credentials, write learner records, activate
hosted persistence, or remove the closed-local fallback.

## Verification

- `node scripts/verify-hosted-persistence-opt-in-decision-packet.mjs`
- `node scripts/verify-foundation-composition.mjs`
- Web typecheck and production build
