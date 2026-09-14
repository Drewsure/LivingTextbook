# Build Session 0779: Neutral Curated Activity Offer Contract

## Completed

- Moved `UnitGameOffer` and `UnitGameOfferMap` into the content-model package.
- Exposed the contracts through the package root.
- Changed launch, student, teacher, dashboard, and game-shell consumers to use
  the neutral contract.
- Kept the former web path as a compatibility re-export.
- Added verifier coverage against web-owned contract definitions and internal
  package subpath imports.
- Recorded ADR 0776, DR-853, and Principles and Standards entry 200.

## Boundary

This changes contract ownership only. Curated maps remain provider-resolved and
pre-reviewed. No new game, live upload, persistence, classroom launch, or
Phaser source promotion is enabled.

## Verification

- Web typecheck passed.
- Foundation composition passed.
- Production webpack build passed after package-root promotion.
- The route suite remains covered by the prior full 88-route pass; rerun it
  after the next server-backed change.
