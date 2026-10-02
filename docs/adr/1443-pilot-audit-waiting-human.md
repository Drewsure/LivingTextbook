# ADR 1443: First Saleable Pilot Audit Reaches Waiting-Human

## Status

Accepted. The code-side pilot audit is current; release remains human-gated.

## Decision

Treat `waiting-human` as the correct pilot state once the source-bound production build proof, operator handoff, and foundation contracts pass. Do not manufacture publisher, rights, delivery, release, or Z.ai evidence to turn the audit green.

## Current result

- Production build proof passes for commit `866717690a64bf5a198a8c55d761928e30ecace2`.
- Operator handoff and foundation contracts pass.
- Publisher source package, delivery policy, package-review evidence, release authorization, and final checksums remain human inputs.
- The Z.ai candidate remains review-only until the corrected wrapper evidence gate passes.

## Consequence

The next engineering work may continue on platform-owned contracts and review tooling, but no package promotion, QR print authorization, student activation, or external game source import is implied by the waiting-human state.
