# ADR 0824: Pilot End-to-End Session Rehearsal

## Status

Accepted for browser rehearsal and verification.

## Context

The platform has separate route, evidence, teacher-report, and hosted
persistence safeguards. The next risk is proving that they operate as one
white-label student journey rather than as disconnected feature previews.

## Decision

Use one explicit rehearsal sequence for the first production-shaped slice:
Front Door -> Flashcards -> Memory Match -> Sentence Builder -> Teacher Report.
Require the first unlock to come from target-language Flashcard completion,
require validated handoffs for later routes, and preserve cumulative local
evidence under one tenant/package/student-session identity. Keep hosted durable
writes feature-gated and disabled by default.

## Consequences

- The pilot can be rehearsed end to end without collecting real learner data.
- Route retries and repeated completions can be verified without inflating
  evidence or rewards.
- Teacher reports can demonstrate progression continuity while remaining
  read-only and privacy bounded.
- The same contract can later back a hosted adapter after policy, retention,
  authorization, privacy, and release approval are accepted.
