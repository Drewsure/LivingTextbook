# ADR 0703: Phaser Candidate Return Package Check

**Status:** Accepted
**Date:** 2026-09-13

## Context

The platform can now request evidence for one isolated Phaser candidate, but a
future return must be checked on disk before Codex evaluates wrapper
compatibility. Existing review records protect the contract; they do not by
themselves prove that a returned folder contains the files it claims to
contain.

## Decision

Add `verify:phaser-candidate-package` as a manual controlled-intake command.
It reads `evidence/return-package.json` from the path in
`LIVING_TEXTBOOOK_ZAI_CANDIDATE_ROOT`, verifies the immutable MiniStar snapshot,
Memory Match target, pairing engine, eight reviewed artifact kinds, safe paths,
and SHA-256 checksums, and requires the blocked-action list.

The check is deliberately excluded from `verify:foundation` because the
returned package is external evidence and may not exist in the canonical
repository. Missing evidence reports `NOT READY`; a passing check proves
artifact integrity and provenance only, never wrapper approval.

## Consequences

- A returned package cannot silently claim files that are absent or altered.
- Candidate evidence remains tenant- and snapshot-bound before detailed review.
- No source is copied, executed, routed, scored, persisted, published, or
  assigned by the command.
- The same pattern can later support Balloon Pop after Memory Match review.
