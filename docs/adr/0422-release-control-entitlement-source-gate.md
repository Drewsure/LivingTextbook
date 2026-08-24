# ADR 0422: Release-Control Entitlement Source Gate

Status: Accepted

## Context

Package adoption storage guards are now visible on `/teacher/entitlements`, but release-control routes also need to show that premium package adoption remains blocked during go/no-go review.

## Decision

Add `/teacher/entitlements` as a release source route and add blocked release actions for premium package adoption activation, billing entitlement writes, microphone scoring enablement, and report export enablement.

## Consequences

- Release-control review now points admins back to the entitlement guard before any premium-dependent release.
- Premium package adoption remains review-only.
- Future release readiness can require accepted package adoption records without changing the current review-only route shape.
