# ADR 0764: Flashcard Entry Runtime Gate

## Status

Accepted

## Context

The FlashcardDemoFlow statically required target-language engagement before
the teacher-QR learner could continue, but the runtime behavior suite did not
prove the adapter's partial-completion and unlock behavior.

## Decision

Require runtime evidence that incomplete target-language engagement returns no
events and no completion, while a complete reviewed entry pass awards the
canonical entry dust, marks Flashcards complete, emits unlock events, and
marks support-language unlocking false on every unlock event.

## Consequences

The QR onboarding gate is now protected both at the UI contract and adapter
runtime boundary. Assist language remains comprehension support and cannot
advance the learner. No new persistence or route authority is created.

## Verification

Run `npm run verify:runtime-behavior` and the complete
`npm run verify:foundation` suite.
