# ADR 1369: Deterministic QR Print Profile

## Status

Accepted for the v1 closed-local pilot assembly contract.

## Context

The local package assembler already produces a generated SVG QR artifact,
alias/fallback mapping, HTML checksum, and integrity ledger. A printable
publisher handoff also needs reproducible physical geometry so a later operator
or tenant adapter cannot silently change the scan surface while keeping the
same metadata identity.

## Decision

Add a shared `PilotQrPrintProfile` to the reviewed QR print artifact. The v1
profile is fixed to A4 portrait, two cards per row, 260px QR output, a
two-module quiet zone, and monochrome output. The assembler binds the profile
to the SVG generation and print HTML, and the behavior harness verifies the
manifest/HTML agreement.

This is a print reproducibility contract, not a release or activation grant.
Tenant-specific profiles require a later versioned white-label configuration
decision and must not be inferred from browser styling.

## Consequences

- Printed sheets are reproducible for the first saleable local pilot.
- QR identity, fallback routing, and physical geometry are reviewed together.
- Future tenant branding can extend the profile without changing the core
  route or package contracts.
- The current fixed profile is intentionally conservative and is not a claim
  that every publisher's printer or paper stock has been certified.

## Verification

- `node scripts/verify-local-pilot-package-assembler-behavior.mjs`
- `npm run verify:foundation-composition`
- `npm run typecheck --workspace @living-textbook/web`

