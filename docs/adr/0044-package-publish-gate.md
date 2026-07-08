# ADR 0044: Package Publish Gate

Date: 2026-07-09

## Status

Accepted

## Context

The Living Textbook build now includes a credible teacher intake scaffold, pilot handoff package, unit game offer map, QR alias registry, deployment profile scaffold, policy scaffold, and persistence boundary scaffold. These are valuable independently, but a real school or publisher also needs one release decision surface that answers whether a package is safe to pilot.

Without this, a working route can look more complete than it is. That creates risk around media rights, report exports, backend storage, local/closed deployment promises, and optional premium features.

## Decision

Create a package publish gate as a teacher/admin panel and supporting data contract. The gate aggregates content, media, games, QR, reports, policy, deployment, and persistence into release-blocking checklist items.

A package may be demo-ready while blockers are open. It cannot be treated as pilot-publishable until release-blocking gates are ready.

## Consequences

Positive:

- Makes partner conversations more honest and practical.
- Keeps media, games, QR, reports, policy, and backend decisions connected.
- Supports white-label package maintenance over future textbook editions.
- Avoids premature production promises while keeping momentum.

Tradeoffs:

- The teacher intake page gains another foundation panel.
- The first implementation is still sample-data driven and needs persistence later.
- Some blockers may feel conservative, but that is intentional before real student data or licensed media are involved.

## Verification

Use `docs/verification/PACKAGE_PUBLISH_GATE_CHECKS.md` after pulling connector-side commits.
