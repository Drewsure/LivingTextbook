# ADR 0433: AI Generation Request Storage Guard

## Status

Accepted.

## Context

The teacher generator route has a disabled request builder, but future users and agents need a visible storage gate explaining what must be durable before live AI generation is allowed. This is especially important for white-label tenants where cost approval, media rights, audio coverage, support-language policy, and draft/verifier storage may differ.

## Decision

Add an AI generation request storage guard to tenant generator routes. The guard lists required request, cost, audio, compatibility, media-rights, draft, and verifier records; visible fields; preconditions before a live request; and blocked actions.

## Consequences

- The generator setup remains review-only.
- Live model dispatch, model billing, draft generation, verifier submission, package assembly, route creation, playlist creation, student assignment, and support-language progress stay blocked.
- Tenant-specific request storage requirements become visible before any backend or AI-provider workflow is selected.
