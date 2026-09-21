# Build Session: Pilot Preflight Authoritative Persistence Gate

## Goal

Ensure pilot review readiness uses the same explicit hosted-persistence gate
that controls durable session issuance and writes.

## Change

The persistence status route now reports `rehearsal` for process-memory,
`blocked` whenever a durable deployment gate is incomplete, and `healthy` only
when both operational health and the deployment gate are ready. Pilot preflight
now requires the returned deployment gate to be ready and surfaces its first
safe blocker when it is not.

## Boundary

This remains review-only. It adds no launch authorization, durable write, data
export, credential creation, or Z.ai/Phaser promotion.

## Verification

- pilot preflight behavior, including blocked-gate evidence
- persistence runtime and authorization verification
- web typecheck
- production build
- active route verification
