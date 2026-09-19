# ADR 0884: Pilot Status Refresh

## Status

Accepted for foundation hardening.

## Context

Pilot persistence readiness has a five-minute freshness contract. A teacher
session panel can remain open longer than that, so a one-time status request
would leave the visual review state disconnected from the current provider and
policy boundary.

## Decision

The teacher session evidence panel refreshes the tenant-scoped persistence
status read-only every minute while mounted. It clears the previous snapshot
when the expected tenant changes, ignores results after unmount, and clears
the interval during cleanup. No refresh path writes learner data, changes
policy, activates storage, or authorizes launch.

## Consequences

- Long-lived teacher review tabs observe provider and policy changes without
  requiring manual reload.
- The five-minute freshness rule remains meaningful in browser behavior, not
  only in pure function tests.
- The refresh cadence is inexpensive and vendor-neutral because it uses the
  existing status endpoint.
- Live classroom operation and durable writes remain explicitly blocked.

## Evidence

- `apps/web/src/features/teacher/TeacherSessionLocalEvidencePanel.tsx`
- `apps/web/src/features/persistence/persistenceStatusClient.ts`
- `scripts/verify-pilot-session-rehearsal.mjs`

