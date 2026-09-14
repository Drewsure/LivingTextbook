# ADR 0736: Progress Envelope Stream Input Boundary

## Status

Accepted

## Context

Progress-event envelopes can arrive from browser, report, import, persistence,
or external-game adapters. The stream helpers were typed as arrays and called
collection methods immediately, so malformed runtime data such as `null` could
throw before a validation decision was returned.

## Decision

Treat stream inputs as untrusted values at the runtime boundary. The validator
must return a deterministic error for any non-array input. The warning helper
must return a clear report-preview warning for the same condition. Valid arrays
retain the existing event, context, and duplicate-id checks.

## Consequences

Malformed report or adapter payloads fail closed with actionable diagnostics and
cannot crash a route or runtime adapter through an array-method exception. This
does not change scoring, progression, persistence, rewards, or assignment
authorization.

## Verification

Run `npm run verify:runtime-behavior`, `npm run verify:taxonomy`, both workspace
typechecks, and `npm run verify:foundation`.
