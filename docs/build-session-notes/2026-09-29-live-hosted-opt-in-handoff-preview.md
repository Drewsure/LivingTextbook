# Build Session: Live Hosted Opt-In Handoff Preview

Date: 2026-09-29

## Delivered

- Connected the package-readiness binding's live hosted or hybrid persistence
  preview to the publisher quarantine handoff surface.
- Rendered tenant, package, quarantine-linked packet, and checksum identities,
  check results, blocked reasons, required human decisions, and the explicit
  no-write state.
- Extended the hosted-persistence verifier so the live handoff cannot silently
  regress to a static sample-only preview.

## Boundary preserved

This remains a review-only display. It does not record opt-in, select a
provider, store credentials, create learner records, enable hosted writes, or
activate student routes. The closed-local fallback remains available.

## Verification

- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web -- --webpack`
- `node scripts/verify-hosted-persistence-opt-in-decision-packet.mjs`
- `node scripts/verify-foundation-composition.mjs`
- `git diff --check`

All checks passed for this slice. The remaining pilot blocker is human review
and approval of the publisher package, delivery mode, rights, policy, release,
and persistence decisions.
