# ADR 0475: Z.ai Human Handoff Signal

Status: Accepted

Date: 2026-09-02

## Context

The user is actively building game prototypes with Z.ai while Codex builds the LivingTextbook architecture, route contracts, audio rules, storage boundaries, and verification gates.

That work can be valuable, but it should not enter the main app before Codex asks for it. The product needs a visible timing signal so the user knows when to hand over Z.ai branches, archives, demo links, or fixtures.

## Decision

Extend the Z.ai prototype intake alert with explicit human handoff timing and render it on both the game-readiness workbench and tenant prototype review pages.

The alert now states:

- Human handoff signal
- Current human action
- No Z.ai source handoff requested yet
- No Phaser import requested yet
- No archive upload requested yet
- No pull request requested yet
- No app patch requested yet

## Guardrails

- Z.ai work remains isolated in `Drewsure/ministar-lab` or another explicitly approved prototype repository until Codex issues the intake alert.
- Codex owns the readiness signal, architecture, schema discipline, wrapper/integration review, and final merge decision.
- No route replacement, scoring mutation, reward write, playlist write, package promotion, app patch, or student assignment can happen from the alert.
- Prototype-readiness verification and active route verification must protect the timing language on `/teacher/game-readiness`, `/teacher/prototypes/ministar`, and `/teacher/prototypes/sample-publisher`.

## Verification

- `npm.cmd run verify:prototype-review`
- `npm.cmd run verify:review-keys`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`
