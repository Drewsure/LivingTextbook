# ADR 0743: Target-Language Audio At Completion Boundary

## Status

Accepted

## Context

The platform intentionally supports assist languages, including Japanese, for
learner comprehension. Progression and completion must still be driven by the
target language. Before this decision, the canonical event validator checked
that audio existed and had a language, but a support-language cue could pass a
playable completion gate if a wrapper selected it by text alone.

## Decision

When a playable route has unit and tenant language context, its completion gate
passes the target language to the canonical event validator. Every learner-
facing `audio_requested` event must match that language, with compatible
regional tags accepted. Support-language events remain useful evidence of
assistance but cannot satisfy the target-language completion boundary.
Route shells and teacher/student launch flows filter the cue list before it
reaches a playable wrapper, while the full cue set remains available to
support and review panels.

## Consequences

Japanese-support audio can remain available without becoming a progression
shortcut. A cue-selection defect becomes visible at completion rather than
silently granting credit. Report-only validator callers without unit context
remain compatible and continue to validate the structural audio contract.

This does not enable live persistence, scoring mutation, progression, rewards,
assignment, or source promotion.

## Verification

Run `npm run verify:runtime`, the canonical game verifier, workspace typecheck,
the production build, and the active route verifier.
