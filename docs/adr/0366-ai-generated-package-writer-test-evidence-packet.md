# ADR 0366: AI Generated Package Writer Test Evidence Packet

Date: 2026-08-10

## Status

Accepted

## Context

Generated package writer module test plans are visible and preserved as backend-neutral storage records. The next risk is letting future writer tests run before the actual evidence lanes for fixtures, routes, audio, media, local packages, assignments, rollback, and support-language boundaries are named.

## Decision

Add a review-only AI generated package writer test evidence packet to tenant generator routes after module test plans. The packet names required evidence lanes, source records, acceptance checks, missing evidence, blocked actions, and next records.

The packet must remain blocked. It cannot run writer tests, run mutation browser checks, upload evidence, capture signed approval, patch app files, write generated package JSON, mutate route registries, create playlists, package local bundles, activate assignments, mutate production QR redirects, or accept support-language-only evidence passes.

## Consequences

- Future writer test harness work gets explicit evidence expectations first.
- Partner publishers and MiniStar share the same proof vocabulary without enabling package writes.
- This does not create a test runner, evidence upload flow, signed approval capture, or any writer implementation.
