# DR-721: Quiz Canonical Integration

**Date:** 2026-09-13  
**Status:** Accepted  
**Area:** Canonical game integration / selection engine

## Decision

Quiz joins the canonical DOM slices. Its prompt, option, answer, mastery,
completion, audio, scoring, tenant, launch, and replay evidence must flow
through the shared platform contracts.

## Consequences

- The selection parent engine has both assessment and arcade reference slices.
- Teacher evidence can distinguish answer choice audio from answer results.
- Future Phaser selection skins must preserve this contract.
- Frozen Z.ai/Phaser work remains isolated until separately mapped and approved.
