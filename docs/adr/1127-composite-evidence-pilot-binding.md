# ADR 1127: Composite Evidence Pilot Binding

## Decision

Bind the composite browser/privacy/tenant evidence adjudication into the
teacher pilot review surface as a derived, exact-scope binding. The binding
must distinguish awaiting evidence, blocked evidence, and accepted-for-pilot-
review states while preserving the canonical pilot decision identity.

## Boundaries

This binding is review-only and provider-neutral. Even accepted evidence
cannot enable pilot launch, student-data collection, report export, package
promotion, QR mutation, or hosted persistence. Frozen Z.ai/Phaser source
remains isolated and is unaffected by this binding.

## Verification

- `npm run verify-browser-privacy-tenant-evidence-pilot-binding`
- `npm run verify:foundation`

