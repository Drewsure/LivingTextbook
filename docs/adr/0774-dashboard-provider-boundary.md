# ADR 0774: Dashboard Provider Boundary

## Status

Accepted

## Context

The primary dashboard demonstrates the MiniStar tenant, but the reusable
dashboard feature must also be usable by future white-label publishers. Its
previous implementation imported MiniStar launch, package, offer-map, QR,
pilot, and reporting fixtures directly.

## Decision

The app page owns sample tenant composition and passes launch session, content
package, curated offer map, QR paths, package validation results, pilot
readiness, and teacher-summary data into `DashboardOverview`. The reusable
dashboard owns layout and feature composition only; it does not resolve sample
fixtures at runtime.

## Consequences

New tenants can provide equivalent package and reporting records without
forking the dashboard. The MiniStar home page remains a reference tenant while
the white-label component stays data-driven.

## Verification

Run `npm run typecheck --workspace @living-textbook/web`,
`npm run verify:foundation-composition`, and `npm run verify:routes`.
