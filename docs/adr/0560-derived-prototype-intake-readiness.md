# ADR-0560: Derived Prototype Intake Readiness

Status: Accepted  
Date: 2026-09-11

## Decision

Derive the prototype-intake summary's evidence-alignment lane from the shared
cross-artifact validator. Keep real returned-package, replay, wrapper, and
Codex-decision lanes separate so structural alignment cannot be mistaken for
prototype acceptance.

## Why

The review workbench contains planning records before a real Z.ai or Phaser
package is returned. A manually written summary could claim readiness after
those records drift or could imply that a structurally aligned sample is an
accepted external build. Derivation makes the displayed status follow the
validator while preserving the remaining blockers.

## Guardrails

- Alignment errors become a visible blocked lane.
- A green alignment lane is review evidence only.
- It does not authorize source import, route replacement, scoring mutation,
  package promotion, or student assignment.
- The Z.ai alert remains not-ready until a specific returned package and all
  required evidence are present.

## Verification

The readiness summary derives from
`apps/web/src/data/sampleAiPrototypeEvidenceAlignment.ts`.
Run `npm run verify:foundation` after changes.
