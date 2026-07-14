# ADR 0223: Report Package Launch Gate Boundary

Date: 2026-07-15

## Status

Accepted

## Context

The teacher report package route previews sanitized reporting and event acceptance details. Because it is closer to export behavior than the general session monitor, it must carry an equally visible launch and export boundary.

## Decision

Render the same session launch gate boundary above the report package preview route.

The boundary states that live classroom launch, real learner data collection, and report export remain blocked until policy, persistence, access control, approval, dry-run, event acceptance, and classroom launch gates are closed.

## Consequences

- Report package previews now inherit the same release-control language as teacher session monitors.
- Route verification checks both MiniStar and sample publisher report package routes for the launch boundary.
- This does not enable report export, live learner data, launch buttons, or pilot approval.
