# ADR 0821: Production-Shaped Vertical Slice Handoff

Status: Accepted for canonical route integration

## Context

The platform already has canonical flashcard, Memory Match, and Sentence
Builder surfaces, but navigation from one route could bypass the session-route
handoff record. The destination shell correctly rejected a missing handoff,
which made some reviewed Open links appear to fail even after the student had
unlocked the activity.

## Decision

Use one shared browser-session handoff helper for the first production-shaped
vertical slice. Flashcard recommendations and completed canonical games must
save a handoff before navigation. The helper validates the tenant, package,
launch code, student session, progression snapshot, and destination route.

Sentence Builder receives the same package identity as Memory Match so its
destination gate has the complete binding.

## Consequences

The QR-led path is now structurally honest: an unlocked activity can be
opened, and a pasted direct URL cannot bypass the gate. The first slice stays
review/local-session scoped; it does not turn browser session storage into
production learner-data persistence.

## Revisit trigger

Revisit when the hosted progression adapter becomes the approved runtime
source for route handoffs, or when a returned Z.ai candidate is explicitly
approved for wrapper integration.
