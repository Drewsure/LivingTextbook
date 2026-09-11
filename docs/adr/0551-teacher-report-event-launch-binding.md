# ADR-0551: Teacher Report Event Launch Binding

Status: Accepted  
Date: 2026-09-11

## Decision

Every event envelope supplied to a teacher report runtime request must include a `launch_code` matching the request's `launchCode`.

## Context

The shared stream validator protects unit, launch, acceptance-gate, taxonomy, and settings-contract consistency when values are present. Teacher reports have a stronger boundary: the request itself names the launch whose evidence is being reviewed. Missing or cross-launch evidence must not be treated as that report's data.

## Consequences

- Unbound report event envelopes become review blockers.
- Cross-launch report evidence becomes a review blocker.
- Generic pre-launch stream review remains available outside the report runtime.
- This remains a verification guard before report export or persistence integration.

## Verification

- Runtime behavior rejects missing and mismatched report launch codes.
- Content-model and web typechecks must pass.
- Foundation verification must pass before release.
