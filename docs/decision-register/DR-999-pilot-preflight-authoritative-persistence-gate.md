# DR-999: Pilot Preflight Authoritative Persistence Gate

Decision: pilot preflight must require the explicit persistence deployment
gate to be ready, and the status endpoint must derive its effective status from
that gate before reporting health.

Required invariants:

- Process-memory reports rehearsal, not healthy durable readiness.
- A blocked durable gate reports blocked and cannot satisfy pilot preflight.
- Pilot review remains launch-blocked and durable-write-blocked.
- Gate blockers are safe operational text only; no learner or secret data is
  exposed.

Evidence: `docs/adr/0927-pilot-preflight-authoritative-persistence-gate.md`,
`apps/web/src/app/api/persistence/status/route.ts`,
`apps/web/src/features/persistence/pilotSessionPreflight.ts`, and
`scripts/verify-pilot-session-preflight-behavior.mjs`.
