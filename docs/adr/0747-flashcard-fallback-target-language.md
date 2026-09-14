# ADR 0747: Flashcard Fallback Target-Language Alignment

## Status

Accepted

## Context

The flashcard entry card already preferred reviewed target-language audio
cues, but fallback speech controls used English literals. A white-label tenant
with Japanese or another target language could therefore hear learner-facing
instructions in the wrong language when a cue was missing.

## Decision

The flashcard entry card resolves target language from tenant settings first,
then the unit textbook reference, with English as the final baseline. Fallback
instruction, entry, gate, term, and sentence speech use that resolved language.
Assist-language glosses remain separate support controls and never call the
target-practice completion handler.

## Consequences

The first learner onboarding slice preserves the white-label language contract
even when a reviewed cue is incomplete. Missing target audio remains visible as
a content-quality issue rather than silently changing the learner language.

## Verification

Run `npm run verify:canonical-games`, workspace typecheck, production build,
and the active route verifier.
