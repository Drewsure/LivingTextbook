# ADR 0996: Printed QR Binding Preview Uses the Shared Review Gate

Status: Accepted for review-only implementation

## Context

Printed textbook QR codes are long-lived entry points. The worksheet preview
must therefore show the same tenant, package, release, fallback, and rollback
evidence used by the QR route preview. A browser-print button must not be
mistaken for authorization to generate or publish a production redirect.

## Decision

The printable worksheet preview consumes a provider-neutral, review-only QR
alias request and the shared QR alias runtime adapter. It shows a stable
textbook target when the unit has a complete textbook identity, otherwise it
shows a safe front-door fallback and an explicit missing-identity state.

The preview remains side-effect free. It does not generate a QR image, write
an alias, activate a release, mutate a redirect, swap a package, or execute a
rollback.

## Consequences

- Printed-material planning and web QR preview use one runtime contract.
- Missing textbook identity is visible before durable print workflows exist.
- Durable alias persistence, rights, release, local fallback, and rollback
  evidence remain required before long-lived textbook printing.
- A future QR renderer can be added behind this contract without changing the
  worksheet's safety boundary.

Evidence: `apps/web/src/data/samplePrintableQrAliasPreview.ts`,
`apps/web/src/features/printables/PrintableWorksheetPreview.tsx`, and
`scripts/verify-qr-print-preview-integration.mjs`.
