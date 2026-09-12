# ADR 0665: Phaser Source Evidence Reproducibility Check

**Status:** Accepted  
**Date:** 2026-09-13

## Decision

Provide a standalone source-evidence check that reads the review packet's
snapshot identity and hashed file manifest, then compares each hash with the
isolated frozen snapshot on disk. It remains outside the normal foundation
command because the frozen Z.ai source is deliberately external to the repo.

## Rationale

A manifest is stronger when it can be replayed against the artifact it names.
This verifies provenance without importing source, adding a dependency, or
making the external snapshot part of the product build.

## Consequences

- The current five-file packet is reproducibly auditable.
- A changed or missing frozen file fails the check before wrapper review.
- Clean repository clones can still run the normal foundation gate without
  requiring the external snapshot.
