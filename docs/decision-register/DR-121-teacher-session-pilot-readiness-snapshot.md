# DR-121: Teacher Session Pilot Readiness Snapshot

## Decision

Add a session-level pilot readiness snapshot to teacher session monitor pages.

## Reason

The teacher session view needs a concise commercial and classroom answer: this route is useful as a demo monitor, but not yet a live classroom reporting system. That status should be derived from existing setting, control, audio coverage, and report-policy blockers rather than hand-written copy.

## Standard

- Teacher session pages show `Session pilot readiness`.
- Demo-safe signals are separated from pilot blockers.
- Live-use requirements are listed before a session can become classroom-ready.
- The snapshot derives status from session settings, lifecycle controls, report export, and assigned game audio coverage.
- The route verifier checks the snapshot remains visible on MiniStar and partner teacher session routes.

