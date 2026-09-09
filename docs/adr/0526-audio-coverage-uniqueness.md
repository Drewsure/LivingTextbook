# ADR-0526: Audio Coverage Uniqueness

Status: Accepted

## Context

Audio plans count cues for vocabulary, sentence, instruction, feedback, and game-mode coverage. A cue may be reused across these different groups, because the same learner audio can serve a flashcard and a memory game. Repeating a cue inside one group, however, can inflate coverage counts and hide a missing term or instruction.

## Decision

Reject duplicate cue IDs within each coverage group. Allow reuse across separate groups. Duplicate audio cue IDs in the package remain a separate hard error.

## Consequences

Coverage counts remain honest without forcing unnecessary duplicate recordings. The rule is package validation only and introduces no provider, storage, playback, release, or learner-state behavior.

