# ADR 0742: Required Scoring Profile At Playable Boundary

## Status

Accepted

## Context

The shared content model and web catalog now agree on the canonical scoring
profile for each mode. Several game wrappers still used literal identifiers or
nullable fallbacks, which allowed a future mapping failure to emit misleading
mastery or completion evidence.

## Decision

Playable canonical wrappers must resolve a required scoring profile from the
shared mode map. They must use the resolved profile identifier in mastery and
completion metadata. Engine preview adapters must also consume the canonical
map. Missing configuration fails clearly rather than falling back to none or
another profile.

## Consequences

Scoring evidence remains mode-bound across browser games and future Phaser
wrappers. A configuration defect is visible during development and
verification, before a tenant can receive inconsistent scoring. This does not
enable live persistence, scoring mutation, progression, rewards, assignment,
or source promotion.

## Verification

Run npm run verify:canonical-games, npm run verify:game-modes, both workspace
typechecks, and npm run verify:foundation.
