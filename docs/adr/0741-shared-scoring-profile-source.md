# ADR 0741: Shared Scoring Profile Source

## Status

Accepted

## Context

The canonical content-model validator already owned the mapping from each
supported game mode to its deterministic scoring profile. The web game-mode
catalog and scoring helper repeated that mapping independently. A new mode or
profile could therefore pass local typechecking while the browser catalog and
canonical validator disagreed.

## Decision

Keep the mode-to-profile mapping and its derived profile identifier type in the
content model. Web catalog entries and scoring lookup must consume that map
directly. The web lookup is total for the supported canonical modes rather
than an optional partial record.

## Consequences

Adding or changing a canonical game mode now has one profile assignment to
review at the shared package boundary. Browser games and future Phaser
wrappers cannot quietly fall back to an unscored mode profile. This does not
enable live persistence, scoring mutation, progression, rewards, assignment,
or source promotion.

## Verification

Run `npm run verify:canonical-games`, `npm run verify:runtime-behavior`, both
workspace typechecks, and `npm run verify:foundation`.
