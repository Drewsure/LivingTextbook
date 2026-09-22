# ADR 0990: External Candidate Handoff Diagnostics

## Decision

Distinguish frozen Phaser source snapshots from returned evidence packages in
the candidate verifier when the required return manifest is absent.

## Boundaries

- The frozen snapshot remains read-only source context.
- No synthetic manifest, source copy, import, route replacement, or promotion
  is permitted to satisfy the check.
- Returned evidence must remain outside the LivingTextBook repository and pass
  the existing candidate package contract.

## Rationale

The controlled Z.ai handoff depends on a human moving a complete evidence
packet between repositories. An explicit diagnostic prevents a missing packet
from being “fixed” by weakening provenance or confusing source preservation
with candidate review.

Evidence: `scripts/verify-phaser-candidate-package.mjs`,
`scripts/verify-phaser-candidate-package-behavior.mjs`, and
`docs/agent-briefs/ZAI_MEMORY_MATCH_EVIDENCE_REQUEST.md`.
