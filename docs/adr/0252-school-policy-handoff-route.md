# 0252 School Policy Handoff Route

Status: accepted
Date: 2026-07-16

## Context

The school policy handoff packet is visible on large admin pages, but school or publisher meetings need a focused URL that opens the meeting packet directly. The route must remain review-only and must not become an approval or launch workflow.

## Decision

Add `/teacher/policy-handoff/[packetId]` as a focused teacher/admin route for the school policy handoff packet.

The route renders the handoff packet, the source school launch policy gate, and source links back to teacher intake, classroom launch gate, teacher dry run, and evidence handoff.

## Consequences

- School and publisher review can open the exact packet without navigating the large intake page.
- The active route verification map now includes 47 checked routes.
- The partner demo and launch gate pages can link directly to the school meeting packet.
- No policy acceptance, signed approval capture, evidence export, assignment creation, release-state mutation, launch-ready status, local activation, production QR promise, learner data, report export, or live classroom workflow is enabled.
