# ADR 0021: Multi-Tenant Front Door Resolver

Status: Accepted

Date: 2026-07-01

## Context

The front-door route is central to the white-label textbook companion product. It allows QR codes, textbook codes, and student user codes to open a tenant-specific reviewed package while keeping teacher reporting possible.

The first implementation only allowed `/enter/ministar`, which proved the flow but left a MiniStar-only route assumption in the app layer.

## Decision

Add a sample front-door resolver that maps a tenant id to the correct tenant config, content package, launch session, access policy, and expected demo codes.

The active scaffold now supports:

- `/enter/ministar`
- `/enter/sample-publisher`

## Consequences

The route layer no longer rejects non-MiniStar tenants by default. Partner front-door behavior is still static demo data, but the shape matches the future registry/persistence boundary.

## Guardrails

- Do not place tenant-specific front-door logic inside the route component.
- Do not let front-door code entry bypass target-language practice gates.
- Do not treat demo codes as production security.
- Move from static resolver data to tenant route registry/persistence before a real pilot.
