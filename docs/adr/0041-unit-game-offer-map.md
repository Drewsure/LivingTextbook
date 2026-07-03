# ADR 0041: Unit Game Offer Map

Date: 2026-07-03

## Status

Accepted

## Context

The Living Textbook platform should not build isolated game pages for every publisher or every mode. A textbook partner needs a maintainable way to say which games are available for a unit, which are required, which are optional, which are premium, which are teacher-only, and which are hidden or blocked until reviewed.

This is especially important for annual textbook editions because game offerings may change year to year while printed QR codes and teacher reporting remain stable.

## Decision

Add an app-visible unit game offer map scaffold on `/teacher/intake`.

The first map records:

- unit key and label,
- game mode,
- game family,
- parent engine,
- availability state,
- readiness state,
- package tier,
- route expectation,
- audio requirement,
- media requirement,
- teacher controls,
- evidence,
- next step,
- guardrails.

## Consequences

Positive:

- Keeps future game expansion data-driven.
- Supports white-label publisher maintenance.
- Prevents premium games from becoming child-facing pressure loops.
- Keeps microphone games behind teacher approval.
- Makes audio and media requirements visible before new modes are built.

Tradeoffs:

- The first version is app-local sample data rather than a shared content-model contract.
- A later migration into `packages/content-model` is required before production persistence.

## Verification

Use `docs/verification/UNIT_GAME_OFFER_MAP_CHECKS.md` after pulling connector-side commits.
