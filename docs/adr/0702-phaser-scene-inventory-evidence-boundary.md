# ADR 0702: Phaser Scene Inventory Evidence Boundary

**Status:** Accepted
**Date:** 2026-09-13

## Context

The frozen `Drewsure/ministar-lab` snapshot contains a substantial Phaser
suite, but its summary and catalog counts do not agree with the active scene
files. The LivingTextbook platform must preserve useful source knowledge
without allowing a source count, scene lifecycle, or source-owned behavior to
silently become a production contract.

## Decision

Maintain an exact, SHA-256-backed scene inventory in
`docs/ZAI_MINISTAR_LAB_SUITE_INVENTORY_2026-09-12.md`. Every active scene is
listed with an evidence-only candidate mode, family, and parent-engine
mapping. The inventory is protected by `verify:phaser-scene-inventory` and is
part of `verify:foundation`.

The inventory records 32 active scenes, the frozen commit and tag, and the
known mismatch with the source summary's claim of 25 games. It does not copy,
execute, bundle, route, score, persist, publish, or assign any source scene.

## Consequences

- The source suite can be reviewed systematically without confusing source
  inventory with canonical product scope.
- Memory Match and Balloon Pop remain the first wrapper candidates, in that
  order, under the existing candidate review packets.
- Unregistered scenes remain useful design input but require a new canonical
  mode contract before any wrapper proposal.
- Hash changes, count changes, and mapping changes become visible verification
  failures rather than quiet drift.

## Human handoff trigger

Human/Z.ai assistance is now appropriate for the specific candidate review
stage, but only as evidence production. Request one named candidate's fixture
replay, target-language audio map, mobile/accessibility capture, and wrapper
notes. Do not request a broad source merge or a production pull request.

## Revisit trigger

Revisit this decision if the frozen source identity changes, a later snapshot
adds or removes active scenes, or a candidate review proves that the proposed
parent-engine mapping cannot express the interaction without changing the
canonical contracts.
