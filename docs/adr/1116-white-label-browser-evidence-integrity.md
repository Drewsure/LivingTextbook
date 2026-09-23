# ADR 1116: White-Label Browser Evidence Integrity

## Decision

Every release-readiness packet must label its browser evidence as coded
rehearsal, browser automation, or human observation. Coded rehearsal cannot
satisfy a future pilot-ready packet by itself.

## Rationale

HTTP route checks and component-level harnesses prove useful structural
properties, but they do not prove that a person or browser automation can
complete the interaction. The release contract must expose that distinction
instead of allowing a coded rehearsal to impersonate browser evidence.

## Consequences

- The current sample remains review-only and honestly reports coded rehearsal.
- Stronger browser evidence can be added without changing the data contract.
- Pilot-ready status rejects coded-only browser evidence.
- Release, persistence, export, installation, provider activation, QR
  mutation, and student launch remain disabled.

## Verification

- `node scripts/verify-white-label-release-readiness.mjs`
- `node scripts/verify-white-label-release-readiness-behavior.mjs`
- `npm run verify:runtime-behavior`
- Full foundation verification before publication.
