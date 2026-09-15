# ADR 0806: Cross-route progression handoff

## Status

Accepted for the first production-shaped vertical slice.

## Decision

Curated student activity routes receive progression through a validated continuity envelope rather than URL parameters or a second progression model. During rehearsal, the envelope is stored in browser `sessionStorage` under a key scoped by tenant, content package, launch code, student session, and exact destination route.

The destination route accepts the handoff only when all identity fields and the destination path match. A direct game URL remains locked when no matching handoff exists. The handoff carries the progression snapshot and event cursor only; raw learner audio, transcripts, support-language evidence, and media-only evidence cannot unlock an activity.

## Consequences

- Launch, activity, and future return routes can share one progression identity.
- Printed QR and direct route behavior remain safe and predictable.
- Browser rehearsal state is temporary and must not be described as a classroom record.
- A hosted adapter can replace the browser store without changing game components.
- A durable database, retention schedule, authentication model, and school policy remain explicit follow-up decisions.
