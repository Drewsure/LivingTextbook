# DR-054: Assignment Rollout Gate Before Scheduled Pilot

Date: 2026-07-09

Status: accepted

## Decision

Add an assignment rollout gate to distinguish package readiness, assignment drafting, demo preview, and real pilot scheduling.

## Rationale

The platform is accumulating package, assignment, route, media, and report scaffolds. Without a rollout gate, a demo route could be mistaken for a scheduled pilot.

## Consequences

- Demo preview remains useful.
- Sample publisher pilot blockers are visible.
- Local companion blockers stay visible but do not drive the immediate build.
- Future scheduling UI has a clear contract to satisfy.
