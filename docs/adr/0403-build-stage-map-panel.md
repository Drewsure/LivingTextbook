# ADR-0403: Build Stage Map Panel

Date: 2026-08-21

## Status

Accepted.

## Context

The teacher/admin intake page already exposes many review gates, but the overall build stage can be hard to see quickly. The user also needs Codex to decide when Z.ai work should be formally engaged, without asking for Z.ai intake too early.

## Decision

Add a data-backed `BuildStageMapPanel` to `/teacher/intake`.

The panel summarizes current readiness without enabling actions: foundation structure, active playable route shell, backend review-only contracts, live pilot blockers, controlled game design timing, and Z.ai intake gate status.

## Consequences

- Positive: Future sessions can quickly see where the build stands.
- Positive: Z.ai timing is visible as gated inventory rather than a current integration instruction.
- Positive: Pilot and backend blockers stay understandable near the top of `/teacher/intake`.
- Constraint: The panel must remain read-only until real workflow gates exist.
- Constraint: It must not become an alert that outside prototype intake is required.

## Verification

See `docs/decision-register/DR-474-build-stage-map-panel.md`.
