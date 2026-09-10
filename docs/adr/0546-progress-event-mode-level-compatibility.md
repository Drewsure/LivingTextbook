# ADR-0546: Progress Event Mode-Level Compatibility

Status: Accepted  
Date: 2026-09-11

## Decision

Progress-event envelopes must use a game mode supported at the level encoded in their canonical unit key.

## Context

The envelope validates taxonomy, timestamps, policy settings, curated mode identity, and canonical unit identity. It could still describe a real mode at a level where that mode is not offered by the shared curriculum contract.

## Consequences

- Event evidence stays aligned with unit and activity pathway contracts.
- Valid-but-unavailable combinations become review blockers before future reporting or persistence integration.
- The shared content-model catalog remains the source of truth.
- This remains a verification guard and does not enable gameplay, scoring, persistence, or provider writes.

## Verification

- Runtime behavior rejects `sentence-builder` for `L1`.
- Content-model and web typechecks pass.
- Foundation verification must pass before release.
