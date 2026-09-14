# ADR 0767: Selection Engine Runtime Contract

## Status

Accepted

## Context

Quiz, True/False, Balloon Pop, and later selection skins share one parent
engine. Their current routes use deterministic, data-driven rounds, but the
foundation suite did not execute the preview contract directly.

## Decision

Require runtime evidence that the Selection engine produces deterministic
vocabulary and syntax rounds with unique options, exactly one correct answer,
prompt and option audio text, and the shared interaction event expectations.

## Consequences

Selection skins inherit one auditable content/audio boundary and cannot drift
into independent answer or accessibility rules. This does not authorize
Phaser source promotion, persistence, or student assignment.

## Verification

Run `npm run verify:selection-engine-runtime` and the complete
`npm run verify:foundation` suite.
