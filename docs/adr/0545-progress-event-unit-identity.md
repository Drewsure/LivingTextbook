# ADR-0545: Progress Event Unit Identity

Status: Accepted  
Date: 2026-09-10

## Decision

Progress-event envelopes must use the canonical `tenantId:curriculumId:L[level]:U[unit]` key format.

## Context

The envelope now validates event taxonomy, timestamps, policy settings, and curated mode identity. It previously accepted any non-empty `unit_key`, which could disconnect evidence from the reviewed white-label curriculum package.

## Consequences

- Event evidence remains traceable to tenant, curriculum, level, and unit.
- Generic or malformed unit labels become review blockers before future reporting or persistence integration.
- The shared content-model unit-key contract remains the source of truth.
- This remains a verification guard and does not enable gameplay, scoring, persistence, or provider writes.

## Verification

- Runtime behavior rejects `unit-1`.
- Content-model and web typechecks pass.
- Foundation verification must pass before release.
