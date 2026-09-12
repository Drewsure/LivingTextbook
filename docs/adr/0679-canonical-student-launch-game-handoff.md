# ADR 0679: Canonical Student Launch Game Handoff

Status: Accepted

Date: 2026-09-13

## Context

The student launch route is the primary QR journey: flashcard entry practice
must unlock a reviewed next activity without requiring a new route to become a
second source of truth. The route already owns transient review-session state,
while each canonical game owns its own `game_started` and learning events.

The previous launch flow emitted `game_started` from the parent launch screen
and then mounted a game that emitted its own start event. It also rendered the
first recommended pairing activity as a preview, even though a canonical Match
Up game was already available.

## Decision

The student launch route will select the unlocked next activity in its
transient in-page pathway and mount the canonical game component for the first
supported pairing modes: Match Up and Memory Match.

The mounted game is the only owner of `game_started`. The launch route only
selects the activity and receives its events. On completion, the launch route
filters the accumulated evidence to the active mode and re-runs
`validateCanonicalGameEventSequence` before accepting progression or Star Dust.

At handoff, the launch route creates a transient
`createProgressionContinuityEnvelope` containing the reviewed identity,
progression snapshot, route pair, and event cursor. The envelope is validated
against the expected tenant, package, launch, and learner session before the
game mounts and again before completion. It is not serialized into the URL,
browser storage, or a live persistence provider.

Unsupported future modes may remain explicitly marked as reference previews
until their canonical interactive component is integrated. They must not be
treated as completed games.

## Consequences

Positive:

- The QR launch path now demonstrates a real flashcards -> unlock -> Match Up
  interaction without duplicate start evidence.
- The same canonical event gate protects both standalone game routes and the
  in-page student pathway.
- Progression remains transient and review-only; no URL or browser storage is
  promoted to authority.

Tradeoffs:

- The first supported launch-path game set is intentionally small.
- Full live handoff persistence still requires the separately documented
  provider-neutral continuity and backend approvals.

## Verification

- `scripts/verify-canonical-game-integrations.mjs` checks the launch flow for
  canonical Match Up mounting, event buffering, validation, and duplicate-start
  prevention.
- Manual review should open `/launch/demo-unit-1`, complete target-language
  flashcard practice, start Match Up, and confirm the interactive pairing board
  appears before any standalone route is opened.
