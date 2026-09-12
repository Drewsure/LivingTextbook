# DR-725: Fill in the Blank Canonical Integration

**Date:** 2026-09-13  
**Status:** Accepted  
**Area:** Canonical game integration / text-spelling engine

## Decision

Fill in the Blank joins the canonical DOM slices. Its sentence prompt, choices,
retry behavior, feedback, mastery, completion, audio, scoring, tenant, launch,
and replay evidence must flow through the shared platform contracts.

## Consequences

- The text-spelling parent engine now covers typed response, letter ordering,
  and sentence-context selection.
- Teacher evidence can distinguish sentence audio, choice audio, and answer
  results.
- Future syntax variants and Phaser text skins must preserve the same
  completion and scoring boundary.
- Frozen Z.ai/Phaser work remains isolated until separately mapped and
  approved.
