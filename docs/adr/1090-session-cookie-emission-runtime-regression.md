# ADR 1090: Session Cookie Emission Runtime Regression

## Status

Accepted and implemented on `legacy-source-import`.

## Context

Static source checks confirmed that cookie emitters contained the new bounds,
but source fragments alone cannot prove the browser-facing header is finite,
secure, and fail closed for malformed input.

## Decision

Run a Node-based executable regression through the existing persistence runtime
gate. Load the actual TypeScript helpers, observe their `Set-Cookie` headers,
and assert secure attributes, capped numeric `Max-Age`, and zero `Max-Age` for
invalid expiration input.

## Consequences

- Cookie policy regressions fail the normal foundation gate.
- No additional runtime dependency or test framework is introduced.
- The check remains deterministic and side-effect free.

## Verification

Run `npm run verify:persistence-runtime` and `npm run verify:foundation`.
