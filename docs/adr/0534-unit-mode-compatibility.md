# ADR-0534: Unit Mode Compatibility

Status: Accepted

## Decision

Validate every unit's selected game mode against the shared content-model contract for game family, parent engine, and supported curriculum levels.

## Context

An imported or AI-authored unit can contain individually valid identifiers that describe an impossible combination. For example, a sentence-building mode can be paired with the vocabulary family, a selection engine, or a level where that mode is not offered. Basic enum checks cannot detect this semantic drift.

## Guardrails

- Each supported mode declares one family, one parent engine, and supported levels.
- Family, engine, and level mismatches are review blockers.
- No value is silently inferred or corrected.
- Mode changes require compatibility, route, audio, scoring, and regression review.
- This slice remains validation-only and does not enable gameplay, storage, release, assignment, or student progression.

## Consequence

Reviewers receive deterministic repair feedback when a package's routing metadata conflicts with the curated pathway contract. The same contract can later be consumed by import, verifier, and release adapters without inventing mode behavior in each consumer.
