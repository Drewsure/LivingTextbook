# DR-1081: Same-Origin Mutation Boundary

Status: Implemented; cookie-authenticated JSON mutations require exact origin
binding and persistence writes retain an explicit bearer-token exception.

Decision: Reject originless and cross-origin student-session, teacher-session,
progression, and event POST requests with `403` before side effects.

Guardrails: The bearer-token exception applies only to the progression and
event persistence write routes. It does not bypass tenant authorization,
deployment readiness, school policy, or durable-write gates.

Evidence: `apps/web/src/server/persistence/requestBoundary.ts`,
`scripts/verify-request-boundary.mjs`, and
`docs/adr/1081-same-origin-mutation-boundary.md`.

