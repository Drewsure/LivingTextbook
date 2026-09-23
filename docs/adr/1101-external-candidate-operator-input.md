# ADR 1101: External Candidate Operator Input

## Status

Accepted.

## Decision

The Phaser candidate verifier detects literal placeholder paths before it
resolves the filesystem path. It reports that the operator must provide the
actual absolute returned-package folder and must not use a frozen source
snapshot or a synthetic manifest.

## Rationale

The intake command is deliberately manual because external source review is a
human-controlled boundary. A placeholder should produce a precise correction,
not a misleading missing-directory diagnosis. Better feedback reduces
operator error without turning an unverified folder into a candidate.

## Guardrails

- The candidate root must still be outside the LivingTextbook repository.
- The folder must still contain `evidence/return-package.json`.
- The verifier does not create folders, manifests, archives, routes, app
  files, scoring records, persistence records, or assignments.
- Frozen source snapshots remain source context and are never promoted by the
  diagnostic.

See `scripts/verify-phaser-candidate-package.mjs` and
`scripts/verify-phaser-candidate-package-behavior.mjs`.
