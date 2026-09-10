# ADR-0535: Cross-Catalog Game Contract

Status: Accepted

## Decision

Extend the existing game-mode verification gate to compare the shared content-model compatibility contract with the web game catalog for every supported mode.

## Context

The runtime content model and web catalog both describe game routing metadata. Keeping those descriptions separate is useful for package boundaries, but it creates a drift risk if a mode's family, parent engine, or supported level range changes in only one layer.

## Guardrails

- Every `GameModeId` must appear exactly once in both contracts.
- Family, parent engine, and supported levels must match exactly.
- Missing, extra, and duplicate entries fail `verify:game-modes`.
- New modes require route, scoring, audio, replay, and compatibility evidence.
- This slice is verification-only; it does not enable gameplay, storage, release, assignment, or student progression.

## Consequence

The foundation gate catches cross-layer catalog drift before it can reach package review or future game integration. The check remains centralized in the existing game-mode verification script, keeping maintenance cost low.
