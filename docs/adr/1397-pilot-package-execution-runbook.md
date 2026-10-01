# ADR 1397: Make Local Pilot Package Delivery Executable And Deliberate

## Status

Accepted for controlled pilot operations

## Context

The local package writer, custody checks, QR artifact generation, and runtime
read-back already exist, but a publisher-facing pilot still needs a repeatable
operator procedure. Without one, delivery depends on tribal knowledge and can
encourage unsafe browser-side token handling or bypass of preflight.

## Decision

Document and verify a preflight-first operator procedure that creates a
non-overwriting request draft, runs read-only readiness, requires a one-shot
explicit assembly confirmation, and records integrity/read-back outputs. Keep
the bearer token server-side and keep hosted persistence, QR alias mutation,
learner records, and student activation outside this procedure.

## Consequences

- A controlled local or hybrid pilot can be handed to an operator with a
  deterministic sequence.
- The procedure does not turn review metadata into approval and cannot proceed
  without the existing release and custody records.
- A future authenticated operator console can wrap the procedure without
  changing the package writer contract.
