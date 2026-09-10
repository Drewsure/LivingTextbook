# ADR-0528: Audio Cue Canonical Text And Unit Binding

Status: Accepted

## Context

The package validator already checks audio language, semantic cue kind, coverage counts, media bindings, and duplicate IDs. A cue could still contain unrelated text or be referenced by a unit plan while carrying another unit's key. Both cases create false readiness for young learners and imported white-label packages.

## Decision

Vocabulary and sentence coverage must match the canonical unit payload after whitespace and case normalization. Every cue referenced by a unit audio support plan must carry the same unit key as that plan. Instruction and feedback cues remain kind-checked and unit-bound without requiring an exact match to the unit's vocabulary or sentence arrays.

## Consequences

- Teacher review can trust that learner-critical audio names the content it supports.
- Unit packages cannot silently borrow learner-facing audio from another unit.
- Imported and generated content receives deterministic, provider-neutral repair errors.
- The validator remains side-effect free; provider lookup, storage, playback, release, assignment, and student-state behavior remain separate future gates.

## Verification

- Runtime behavior tests cover wrong vocabulary text, wrong sentence text, and cross-unit cue binding.
- The full foundation gate must pass typechecks, production build, and all active routes.
