# ADR 0887: Phaser Returned-Package Identity Gate

## Status

Accepted for controlled candidate review.

## Context

The standalone Phaser candidate-folder verifier checks the frozen tag and
commit, but the shared returned-package manifest also represents the future
handoff boundary. Without the same rule there, a Phaser or hybrid package
could be structurally valid while carrying a different immutable-looking
snapshot.

## Decision

Returned packages with `targetSurface` `phaser` or `hybrid` must match the
canonical frozen Z.ai/Phaser repository, snapshot tag, and exact commit through
the shared content model. DOM-reference previews remain eligible for their
existing review-only, not-returned state without Phaser-specific provenance.

This gate does not import archives, create routes, approve wrappers, promote
packages, or assign students.

## Consequences

- Standalone package verification and shared returned-package validation agree.
- Phaser provenance drift fails before wrapper review or integration planning.
- White-label DOM-reference prototypes retain a separate, provider-neutral
  review path.

## Evidence

- `packages/content-model/src/aiPrototypeReturnedPackageManifest.ts`
- `packages/content-model/src/phaserCandidateSourceIdentity.ts`
- `scripts/verify-phaser-candidate-package.mjs`
- `scripts/verify-runtime-behavior.mjs`
