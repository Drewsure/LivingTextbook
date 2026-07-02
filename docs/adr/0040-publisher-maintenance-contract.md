# ADR 0040: Publisher Maintenance Contract

Date: 2026-07-03

## Status

Accepted

## Context

The platform needs to serve MiniStar and also future white-label textbook publishers. A publisher may need to maintain music, videos, games, routes, and reports across yearly textbook editions. This cannot be treated as a later bolt-on because it affects data contracts, route stability, media manifests, report policy, and local deployment.

## Decision

Add a publisher maintenance contract and teacher/admin panel that make annual package maintenance explicit.

The first scaffold covers:

- source content review,
- audio/video rights library,
- unit-to-game offer map,
- stable QR registry,
- teacher report policy,
- pilot, annual-edition, and mid-year refresh release windows.

## Consequences

Positive:

- Keeps white-label saleability visible while the product is still early.
- Protects stable printed QR codes.
- Prevents partner media from becoming unmanaged public files.
- Gives future backend work a clear maintenance domain.

Tradeoffs:

- Adds more admin-surface complexity before production persistence exists.
- Requires disciplined verification so this remains a contract, not a false promise of completed backend automation.

## Verification

Use `docs/verification/PUBLISHER_MAINTENANCE_CHECKS.md` after pulling connector-side commits.
