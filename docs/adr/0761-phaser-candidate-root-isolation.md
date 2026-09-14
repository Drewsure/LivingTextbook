# ADR 0761: Phaser Candidate Root Isolation

## Status

Accepted

## Context

The Phaser candidate verifier reads a returned evidence packet from a path
provided by the operator. Relative-path checks protect files inside that
packet, but a candidate root inside the product repository or a symlinked
artifact could still make review tooling inspect the canonical source tree by
accident.

## Decision

Require the candidate package root to resolve outside the `LivingTextbook`
repository. Resolve the return manifest and every artifact before reading,
require regular files, and reject any symlink or resolved path that leaves the
isolated candidate root. Keep the verifier read-only and review-only.

## Consequences

Z.ai may return a package from an isolated sibling folder such as
`zai-review`, but no candidate folder can be staged inside `apps`, `packages`,
`scripts`, or another product path. This reduces accidental source promotion
and makes the human handoff boundary explicit. It does not import source,
create routes, change scoring, or enable student use.

## Verification

Run `npm run verify:phaser-candidate-package-contract` and
`npm run verify:phaser-candidate-package-behavior`. The behavior suite must
prove that a complete synthetic packet passes and that an in-repository root
is rejected.
