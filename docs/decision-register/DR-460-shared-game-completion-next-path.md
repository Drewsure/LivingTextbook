# DR-460: Shared Game Completion Next Path

Date: 2026-08-21

## Decision

Add a shared game completion next-path card to active non-entry student game routes.

## Rationale

As the platform gains more reviewed game routes, each game needs the same learner-facing closeout pattern: show whether the current mode has completed, show deterministic earned reward information, and point the learner to the next reviewed activity, activity hub, or Training Academy. This prevents one-off “what now?” UI fragments and keeps the curated pathway promise stronger than a broad switch-template panel.

## Consequences

- Pairing, selection, text-spelling, and speaking demo flows now render the same `GameCompletionNextCard`.
- The card does not emit unlocks, mutate storage, or award rewards; it only reflects the progression state created by game completion events.
- Active route verification now checks that active non-entry game routes expose `Game complete path` and `Next Activity`.
- Student navigation remains reviewed-pathway-first, with support routes clearly separated from target-language completion.

## Non-Goals

- This does not add premium polish, animation, persistence, live assignments, or public sharing.
- This does not change scoring profiles or unlock logic.
- This does not replace the activity hub.
