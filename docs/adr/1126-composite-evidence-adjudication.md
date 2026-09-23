# ADR 1126: Composite Evidence Adjudication

## Decision

Add a provider-neutral, local adjudication record for the composite
browser/privacy/tenant evidence packet. A reviewer may record a blocked
decision while evidence is incomplete. Acceptance for the next review gate is
valid only when all three lanes are passed in the same exact scope.

## Boundaries

Adjudication preserves packet identity and remains review-only. It cannot
enable hosted persistence, student-data collection, evidence export, release
promotion, QR mutation, or student production launch. It does not select a
backend or import frozen Z.ai/Phaser source.

## Verification

- `npm run verify-browser-privacy-tenant-evidence-adjudication`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web -- --webpack`
- `npm run verify:routes`

