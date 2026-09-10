# ADR-0547: Progress Event Type Identity

Status: Accepted  
Date: 2026-09-11

## Decision

Progress-event envelopes and taxonomy registries must use the reviewed shared event taxonomy categories.

## Context

Runtime envelopes validated taxonomy effects and settings, but a JSON payload could still name an arbitrary event if a registry classified it. That would create an unreviewed evidence lane.

## Consequences

- Unknown event types become review blockers.
- New events require coordinated type, taxonomy, visibility, persistence, and runtime verification work.
- The existing effect categories remain the runtime identity source.
- This remains a verification guard and does not enable gameplay, scoring, persistence, or provider writes.

## Verification

- Runtime behavior rejects `unknown-event`.
- Content-model and web typechecks pass.
- Foundation verification must pass before release.
