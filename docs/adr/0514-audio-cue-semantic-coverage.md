# ADR-0514: Audio Cue Semantic Coverage

Status: Accepted

## Context

Audio plans describe multiple kinds of learner-facing evidence. Counting cues alone cannot prove that vocabulary and sentence coverage are wired to the correct content roles.

## Decision

The shared content-model validator must require `term` cues for vocabulary coverage and `sentence` cues for sentence coverage whenever an audio support plan is required.

The runtime behavior harness covers a wrong-kind vocabulary cue and preserves the existing language, count, missing-reference, and no-side-effect checks.

## Consequences

- Parent game engines receive semantically correct audio inputs.
- Tenant packages can be reviewed consistently without a provider-specific mapping convention.
- Instruction and feedback audio remain extensible without weakening core vocabulary or syntax evidence.
