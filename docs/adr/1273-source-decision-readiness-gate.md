# ADR 1273: Source Decision Readiness Gate

## Status

Accepted.

## Decision

Expose the quarantine source-review decision as an independent check in the
live package-readiness binding.

## Rationale

The handoff needs to show exactly what a source decision closes and what it
does not. A single aggregate status can otherwise hide an incomplete or
changes-required source checkpoint.

## Consequences

- Machine-readable readiness and teacher views share the same source gate.
- A passed source decision cannot be mistaken for release or activation.
