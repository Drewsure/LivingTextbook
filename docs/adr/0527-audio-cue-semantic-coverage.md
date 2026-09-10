# ADR-0527: Audio Cue Semantic Coverage

Status: Accepted

## Context

Audio support plans separate vocabulary, sentence, instruction, feedback, and game-mode coverage. The validator already checks term and sentence semantics, but instruction and feedback arrays could reference any cue kind. That would make a plan appear complete while a game used learner content as a control instruction or retry response.

## Decision

Require vocabulary arrays to use term cues, sentence arrays to use sentence cues, instruction arrays to use instruction cues, and feedback arrays to use feedback cues. Game-mode arrays remain mixed-kind because parent engines legitimately combine those cues.

## Consequences

Audio coverage becomes more meaningful for all games without duplicating files or limiting intentional reuse. Provider selection, playback, storage, release, and student state remain unchanged.

