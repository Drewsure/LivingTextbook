# ADR-0512: Deterministic Progression And Star Dust Behavior Verification

Status: Accepted

## Context

The student experience begins with teacher-led entry practice and then moves into reviewed recommended activities. Star Dust is the mastery-linked engagement currency and must be predictable, bounded, and independent of random rewards.

## Decision

Execute entry progression and Star Dust calculation behavior in the compiled foundation harness.

The harness covers:

- initial entry-practice state;
- reviewed next-mode unlocks after completion;
- completion of the entry mode;
- deterministic repeated scoring;
- the 1,000-dust unit ceiling.

## Consequences

- Future game engines can consume a stable progression contract.
- Teacher reports can reproduce scores from the same evidence.
- No random source, provider, storage adapter, or reward writer is involved.
