# ADR 0776: Curated Activity Offer Contract

## Status

Accepted

## Context

Curated activity maps are consumed by launch, student progression, teacher
reporting, and dashboard surfaces. Their types were defined in a web feature
folder even though the map is tenant-owned content and must be usable by future
hosted, local, and partner providers.

## Decision

Own `UnitGameOffer` and `UnitGameOfferMap` in
`packages/content-model/src/gameOffer.ts` and expose them through the package
root. Keep the old web path as a type-only compatibility re-export during
migration. Providers resolve their own maps; reusable UI receives maps through
explicit props.

## Consequences

White-label tenants can supply curated pathways without forking the web layer.
The map remains the source for reviewed order, level support, parent engine,
audio, reporting, and readiness requirements. Existing UI imports remain
compatible, while new providers can depend on the neutral package directly.

## Verification

Run `npm run typecheck --workspace @living-textbook/web`,
`npm run verify:foundation-composition`, and `npm run verify:routes`.
