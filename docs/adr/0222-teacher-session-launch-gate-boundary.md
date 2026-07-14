# ADR 0222: Teacher Session Launch Gate Boundary

Date: 2026-07-15

## Status

Accepted

## Context

Teacher session monitor routes now preview roster, media, settings, event acceptance, pilot readiness, and report package information. Those surfaces are useful, but they must not imply that the session can be used as a live classroom launch or report export workflow.

## Decision

Add a reusable session launch gate boundary to teacher session monitor routes.

The boundary is derived from the classroom launch gate and states that the monitor is preview-only, that no live classroom launch is allowed, that real learner data remains blocked, and that report export remains blocked until policy, persistence, access control, approval, dry-run, and event acceptance gates are closed.

## Consequences

- Teacher report and monitor previews now carry the same pre-launch boundary as the classroom launch gate.
- The monitor can still support rehearsal and partner review without enabling launch buttons, live learner data collection, or export actions.
- Future persistence can promote this shape into a per-package or per-session launch gate record without changing the teacher-facing contract.
