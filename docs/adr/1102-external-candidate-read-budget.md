# ADR 1102: External Candidate Read Budget

## Status

Accepted.

## Decision

The Phaser candidate verifier caps `evidence/return-package.json` at 64 KiB
and each referenced evidence artifact at 4 MiB before parsing or hashing.
Oversized files fail closed inside the isolated review boundary.

## Rationale

External handoffs are untrusted input. Bounding file reads keeps review
operations predictable and prevents a malformed or accidental large artifact
from consuming unbounded memory before the manifest and evidence rules can
reject it.

## Guardrails

- Size checks occur before JSON parsing, text validation, or checksum hashing.
- The candidate root remains outside the LivingTextbook repository.
- No size check grants trust, execution, promotion, persistence, or assignment
  authority.
- The verifier does not copy source, create routes, or mutate app state.

See `scripts/verify-phaser-candidate-package.mjs` and
`scripts/verify-phaser-candidate-package-behavior.mjs`.
