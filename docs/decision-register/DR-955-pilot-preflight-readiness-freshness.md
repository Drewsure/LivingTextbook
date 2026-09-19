# DR-955: Pilot Preflight Readiness Freshness

## Decision

Controlled pilot persistence readiness must be based on a tenant-bound status
snapshot checked no more than five minutes before evaluation.

## Required Invariants

- The status timestamp must be valid ISO time.
- A future-dated status or a status older than the five-minute window cannot
  pass readiness.
- Freshness is evaluated deterministically through the shared preflight
  constant and remains covered by runtime verification.
- Refreshing readiness is read-only and cannot authorize launch, durable
  writes, activation, export, or release mutation.

## Evidence

- `apps/web/src/features/persistence/pilotSessionPreflight.ts`
- `scripts/verify-pilot-session-preflight-behavior.mjs`
- `docs/adr/0883-pilot-preflight-readiness-freshness.md`

