# DR-703: AI Review Formatter Strict Flags

Status: Accepted

## Decision

AI review-warning formatters must use strict boolean interpretation for approval and
premium-cost readiness at the provider-neutral boundary.

## Evidence

- Direct malformed callers cannot turn string values into ready approval warnings.
- Runtime behavior covers malformed teacher and premium-cost flags.
- AI-service typecheck and boundary verification remain green.
- Provider dispatch, billing, writes, and Z.ai integration remain disabled.

This decision is recorded in `docs/adr/0631-ai-review-formatter-strict-flags.md`.
