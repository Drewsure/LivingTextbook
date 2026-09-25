# ADR 1201: Source Extraction Identifier Boundary

## Decision

Source extraction previews must use bounded safe identifiers for preview,
tenant, source, package, candidate-unit, and segment identities. The allowed
shape supports the platform's namespaced unit keys while rejecting path-like or
control-bearing values.

## Why

Extraction previews are review evidence, but their identities flow into package
assembly and teacher-draft handoffs. Tenant isolation and portable local
deployment require the identity shape to be constrained before those bindings
are created.

## Consequences

- Existing namespaced publisher unit keys remain supported.
- Malformed or path-like identities are rejected before preview generation.
- The preview remains review-only with no storage, promotion, or student-facing
  side effects.
