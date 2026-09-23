# ADR 1100: External Candidate Manifest Boundary

## Status

Accepted.

## Decision

Frozen Z.ai/Phaser source snapshots are never treated as returned candidate
packages. Candidate review begins only when an isolated external folder
contains `evidence/return-package.json`. The returned-package manifest is
validated for immutable source identity, tenant/request identity, safe bounded
artifact paths, bounded artifact count, bounded blocked-action metadata, and
review-only status before evidence alignment or adjudication proceeds.

## Rationale

The platform needs to benefit from external game work without allowing a
source archive, a Git checkout, or a build snapshot to become an accidental
application import. A small manifest boundary gives the team a deterministic
handoff and a safe failure message when Z.ai returns source without the
required evidence packet.

## Guardrails

- Frozen source remains outside the LivingTextbook repository and is never
  copied by the verifier.
- Missing `evidence/return-package.json` is a hard stop.
- Manifest validation does not approve wrapper integration or human review.
- No direct source import, app patch, route replacement, score authority,
  persistence ownership, promotion, or assignment is enabled.
- Runtime checks use synthetic manifest objects and no learner data.

See `packages/content-model/src/aiPrototypeReturnedPackageManifest.ts`,
`scripts/verify-phaser-candidate-package.mjs`, and
`scripts/verify-runtime-behavior.mjs`.
