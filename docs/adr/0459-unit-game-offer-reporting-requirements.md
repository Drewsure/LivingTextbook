# ADR 0459: Unit Game Offer Reporting Requirements

Status: Accepted

Date: 2026-08-31

## Context

The unit game offer map contract already named reporting as part of game availability, but the typed sample data did not require a per-game reporting rule. That created a gap between the white-label teacher reporting promise and the visible game offer review surface.

## Decision

Add `reportingRequirement` to every unit game offer and show it in `UnitGameOfferMapPanel`.

## Consequences

- Every game offer must state what teacher-visible progress it reports before it can be considered student-facing.
- Support-language listens remain report-only and cannot trigger mastery, unlocks, Star Dust, or rewards.
- Speech games must explicitly block raw audio and transcript storage in the core offer map.
- Future game modes, Phaser wrappers, and outside prototypes must return reporting evidence before integration review.

## Still Blocked

- No live event persistence.
- No report export.
- No raw microphone upload or transcript storage.
- No support-language-only progress.
