# ADR-0544: Progress Event Mode Identity

Status: Accepted  
Date: 2026-09-10

## Decision

Progress-event envelopes must use a supported shared `GameModeId` from the content-model catalog.

## Context

The envelope already validates event taxonomy, timestamps, settings policy, and support-only boundaries. It previously accepted any non-empty `game_mode` string, which could allow telemetry to name a mode that had no reviewed catalog, engine, scoring, audio, or reporting contract.

## Consequences

- Event validation now reuses one mode identity source of truth.
- Unknown or retired modes become review blockers before future reporting or persistence integration.
- Adding a mode requires coordinated catalog and contract verification.
- This remains a verification guard and does not enable gameplay, scoring, persistence, or provider writes.

## Verification

- Runtime behavior rejects `unknown-mode`.
- Content-model and web typechecks pass.
- Foundation verification must pass before release.
