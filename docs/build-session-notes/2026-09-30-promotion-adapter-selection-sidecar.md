# Build Session: Promotion Adapter Selection Sidecar

## Outcome

Added the first explicit promotion-adapter decision sidecar to the publisher
pilot review flow. It records the intended closed-local, hosted-PWA, or hybrid
package path while preserving the no-write/no-activation boundary.

## Implemented

- Added the content-model contract and validator.
- Added tenant/quarantine custody read and write functions behind an explicit
  `LIVING_TEXTBOBOOK_PROMOTION_ADAPTER_DECISIONS_ENABLED=true` gate.
- Added the authorized review API and teacher handoff capture panel.
- Bound admission, package review packet, readiness binding, and release
  lineage to the sidecar and source checksum.
- Added mode-to-adapter matching for closed-local, hosted PWA, and hybrid.
- Added focused structural verification.

## Verification

Run:

```powershell
npm run typecheck --workspace @living-textbook/web
node scripts/verify-promotion-adapter-decision.mjs
npm run verify:foundation-composition
git diff --check
```

The adapter remains review-only. No production package, QR print, provider,
hosted write, or student activation is enabled by this slice.
