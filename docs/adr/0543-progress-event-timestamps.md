# ADR-0543: Progress Event Timestamps

Status: Accepted

## Context

The progress-event envelope used `Date.parse` as its timestamp check. That accepts date-only and locale-like values even though the contract requires ISO event evidence. Reports, replay, and future storage adapters need one unambiguous representation.

## Decision

Require `occurred_at` to be a parseable ISO/RFC3339 timestamp with an explicit `Z` or numeric timezone offset.

## Consequences

- Event evidence is comparable across hosted, local, and hybrid deployments.
- Invalid or ambiguous timestamps are blocked before progression review.
- Existing sample events remain compatible because they use UTC ISO timestamps.
- No provider, persistence, progression, or report side effect is introduced.

## Verification

- `node scripts/verify-runtime-behavior.mjs`
- `npm run verify:foundation`
