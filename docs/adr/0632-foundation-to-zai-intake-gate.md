# ADR 0632: Foundation To Z.ai Intake Gate

**Status:** Accepted

## Decision

The verified LivingTextbook foundation permits controlled intake of isolated
Z.ai game prototype packages. The initial approved prototype repository is
`Drewsure/ministar-lab`.

This phase is evidence intake only. It does not authorize copying files into
the canonical application, activating routes, changing scoring or rewards,
promoting packages, writing storage, or assigning prototypes to students.

## Required Return Package

Each candidate must provide source identity, a shared-schema fixture, standard
event and deterministic-scoring replay evidence, target-language audio coverage,
mobile and accessibility evidence, Phaser wrapper notes when relevant, and a
README covering dependencies, controls, rights, and known limitations.

## Ownership Boundary

Codex owns architecture, schema, parent-engine contracts, wrapper boundaries,
integration decisions, and final merge review. Z.ai is an isolated prototype
builder operating within the explicitly approved prototype repository.

## Verification

The foundation gate is verified by `npm run verify:foundation`. Returned
prototype packages must then pass `npm run verify:prototype-review` and the
candidate-specific evidence and wrapper review before an integration proposal.
