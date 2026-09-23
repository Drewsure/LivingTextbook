# ADR 1088: Session Lifetime Bounds

## Status

Accepted and implemented on `legacy-source-import`.

## Context

Session TTL environment values accepted any positive safe integer. That made
an operator typo capable of producing a session lasting far beyond the
intended classroom or teacher-review window.

## Decision

Cap student sessions at 24 hours and teacher review sessions at 12 hours.
Clamp configured TTLs to those maxima and require signed claim lifetimes to
remain within the matching cap on both creation and reading.

## Consequences

- A deployment can safely choose shorter pilot windows.
- Long-lived accidental or stale session claims fail closed.
- The cap is explicit and must be reviewed when a new session type is added.

## Verification

Run the persistence and teacher authorization verifiers, then the full
`npm run verify:foundation` gate after changing session lifetime policy.
