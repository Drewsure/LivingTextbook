# ADR 1091: Session Secret Strength Policy

## Status

Accepted and implemented on `legacy-source-import`.

## Context

Signed session HMAC boundaries previously treated any non-empty environment
value as a usable secret. The example placeholders and short operator values
could therefore make a deployment look configured without a reasonable minimum
secret length.

## Decision

Use one server-only policy requiring at least 32 UTF-8 bytes. Student and
teacher creation, parsing, and persistence deployment readiness all consume
that helper. Weak values fail closed.

## Consequences

- Placeholder and weak secrets cannot authorize or mint sessions.
- Operators must provision independent strong values for student and teacher
  boundaries.
- The rule is length-based rather than a claim of cryptographic randomness;
  secret generation and rotation remain deployment responsibilities.

## Verification

Run `npm run verify:persistence-runtime`, `npm run verify:teacher-operations-auth`,
and the full `npm run verify:foundation` gate.
