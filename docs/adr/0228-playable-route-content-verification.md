# ADR 0228: Playable Route Content Verification

Date: 2026-07-15

## Status

Accepted

## Context

Training Academy, Quiz, Sentence Builder, and Speak It routes were active, but route verification only checked that several of them loaded. This allowed a white-label regression: the sample publisher Training Academy route was using the MiniStar tenant/unit shell.

## Decision

Move the Training Academy route to the shared launch resolver and add content expectations for Training Academy, Quiz, Sentence Builder, and Speak It routes for both sample tenants.

Partner route checks include `Daily Routines` so resolver regressions back to MiniStar data are caught during foundation verification.

## Consequences

- White-label training routes now use the same tenant/package resolver as other playable routes.
- Active route verification proves playable surfaces render the correct activity shells, not just 200 responses.
- This does not add new game mechanics, scoring rules, or premium polish.
