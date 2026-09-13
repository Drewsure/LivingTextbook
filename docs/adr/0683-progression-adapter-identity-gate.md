# ADR 0683: Progression Adapter Identity Gate

## Status

Accepted

## Context

The continuity envelope and canonical report gates validate identity when
evidence is handed between routes. A direct game wrapper can still call a
local progression adapter before either of those later boundaries, however.
Without an adapter-level check, a mismatched unit, launch code, or learner
session could produce a candidate start or completion event.

## Decision

Use the shared content-model `validateProgressionLaunchIdentity` helper at the
local progression boundaries. Entry completion and game completion return
unchanged progression with zero award when identity does not match. Starting a
game returns no event. This check compares `unitKey`, `launchCode`, and
`studentSessionId` and does not create persistence or infer tenant identity.

## Consequences

- Direct adapter callers cannot score or start a mismatched learner/launch.
- The route and report gates remain independent defense-in-depth checks.
- The rule is provider-neutral and applies equally to future hosted, local,
  hybrid, DOM, canvas, and Phaser wrappers.
- The result remains review-safe: no error is converted into a persistence or
  recovery side effect.

## Verification

- The runtime harness accepts matching identities and rejects a mismatched
  launch code.
- Progression-runtime and canonical-game verification check the shared helper.
- Web TypeScript validation covers adapter call-site compatibility.
