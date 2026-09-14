# ADR 0781: UI Package Export Map

## Status

Accepted

## Decision

`@living-textbook/ui` exposes one package-root export whose types and default
target are `./src/index.ts`. Internal primitive paths are not part of the
consumer API.

## Why

White-label themes and reusable application features need a stable component
surface while the internal primitive structure remains replaceable. The same
rule as the content-model package keeps package usage consistent.

## Verification

- The shared package-boundary verifier checks both package manifests.
- Web typecheck and production webpack build pass.

## Non-goals

This does not add theme behavior, live storage, AI calls, or external game
source promotion.
