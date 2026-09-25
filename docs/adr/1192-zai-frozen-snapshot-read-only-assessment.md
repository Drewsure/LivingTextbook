# ADR 1192: Z.ai Frozen Snapshot Read-Only Assessment

## Status

Accepted; integration remains blocked.

## Context

The frozen `Drewsure/ministar-lab` snapshot has reproducible provenance and a
Memory Match Phaser scene. Provenance alone does not establish compatibility
with the LivingTextbook event, audio, scoring, privacy, persistence, or
white-label contracts.

## Decision

Record the first source-level assessment without importing or executing the
candidate inside the canonical application. Memory Match remains the first
candidate, but the snapshot is blocked because shared code owns browser
storage, actor identity, direct telemetry dispatch, score/completion state,
and non-deterministic scene behavior. A pirate-themed shared mascot entry and a
documentation/runtime contradiction are additional review findings.

## Required evidence

The external builder must return the complete evidence package, including
deterministic replay, canonical event mapping, target-language audio coverage,
accessibility, source hashes, wrapper notes, and explicit removal or isolation
of candidate-owned persistence and telemetry.

## Consequences

- The platform can use the snapshot to guide a wrapper without accepting its
  state ownership or product assumptions.
- The next Z.ai task is precise and limited to Memory Match evidence return.
- No direct source merge, route replacement, scoring mutation, package
  promotion, student assignment, or persistence activation is permitted.
