# ADR 0731: Canonical Game Event Payload

## Status

Accepted

## Context

Canonical game adapters and review evidence pass event sequences across a
shared validator. TypeScript types describe valid events but cannot protect a
runtime boundary from a non-array payload, a null entry, or an entry with
unexpected primitive fields. Throwing during validation would obscure the
evidence defect and make the review boundary less reliable.

## Decision

Normalize only valid object entries for sequence inspection and return
actionable errors for non-array collections or malformed entries. Continue to
apply all existing event identity, ordering, audio, replay, scoring, mastery,
completion, and support-language checks to the valid entries.

## Consequences

Malformed external game evidence fails closed without crashing a review or
adapter surface. Valid canonical game behavior is unchanged, and no provider
or persistence side effect is introduced. The event validator remains a
contract check, not a live progression writer.

## Verification

Run `npm run verify:runtime-behavior`,
`npm run typecheck --workspace @living-textbook/web`, and
`npm run typecheck:ai-service`.
