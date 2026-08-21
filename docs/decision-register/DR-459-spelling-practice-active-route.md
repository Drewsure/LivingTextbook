# DR-459: Spelling Practice Active Route

Date: 2026-08-21

## Decision

Add Spelling Practice as a first-class student route under the existing text-spelling parent engine.

## Rationale

The platform needs a reusable orthographic practice step between Type Answer and Sentence Builder. Spelling Practice gives young learners a lower-friction spelling activity with target-language listening, deterministic letter ordering, standard progress events, and no random reward pressure.

## Consequences

- `/spelling/[code]` is now a route contract with a route helper and active MiniStar/sample-publisher demo paths.
- The game mode catalog, scoring profile map, package readiness, local bundle, active route, student activity hub, teacher assignment, and recommended-route surfaces include `spelling-practice`.
- Spelling Practice uses the `spelling-typing-v1` scoring profile and emits the standard game event sequence.
- Support language remains support-only and cannot unlock or complete Spelling Practice.
- Active route verification grows to 73 checked routes.

## Non-Goals

- This does not add a new parent engine.
- This does not add premium visual polish, random rewards, live uploads, assignment scheduling, or persistence writes.
- This does not promote outside prototype code into the app.
