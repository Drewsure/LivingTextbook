# DR-1080: JSON Request Boundary Hardening

Status: Implemented; persistence and session JSON writes use a shared
content-type and byte-limit boundary.

Decision: Require `application/json`, a 128 KiB limit for progression/event
writes, and an 8 KiB limit for student/teacher session creation before route
validation or provider access.

Guardrails: `415` is returned for the wrong media type, `413` for an invalid or
oversized declared/measured body, and `400` for unreadable or invalid JSON.
Durable provider activation, authorization, uploads, route mutation, and
assignment promotion remain governed by their existing gates.

Evidence: `apps/web/src/server/persistence/requestBoundary.ts`,
`scripts/verify-request-boundary.mjs`, and
`docs/adr/1080-json-request-boundary-hardening.md`.

