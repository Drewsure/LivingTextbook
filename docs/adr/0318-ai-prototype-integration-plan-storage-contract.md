# ADR 0318: AI Prototype Integration Plan Storage Contract

Date: 2026-07-31

## Status

Accepted.

## Context

AI prototype integration plans define the wrapper-first path from returned prototype evidence toward a possible future app integration. The plan needs to be durable before backend, hosted, local, or hybrid deployments can trust it as part of a review trail.

Without a storage contract, a wrapper plan could exist only as UI state or informal notes, increasing the risk of direct imports, route writes, sequence changes, scoring changes, audio manifest mutations, package promotion, or assignments before review evidence is complete.

## Decision

Add `ai_prototype_integration_plan` / `ai-prototype-integration-plan` as a backend-neutral storage category across schema drafts, migration candidates, migration specs, durable record plans, hosted adapter plans, local adapter plans, and persistence boundaries.

The record must preserve wrapper adapter review, fixture replay report, event replay report, audio coverage report, scoring replay report, mobile accessibility review, integration lanes, test harness requirements, next review records, and mode integration plans.

Hosted and local adapters must block direct app import, route writes, game sequence mutation, scoring mutation, audio manifest mutation, package promotion, and direct assignment.

## Consequences

- Prototype integration planning becomes auditable before any implementation work.
- Hosted and closed-local customers keep the same wrapper-first safety rule.
- Phaser and premium surfaces can advance as removable wrappers only after replay and accessibility evidence.
- Future integration work has a clean storage boundary to build from.
