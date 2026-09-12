# DR-690: AI-Service Strict Readiness Flags

Status: Accepted

## Decision

AI-service readiness and approval gates must use strict boolean values at the
provider-neutral boundary. Stringified booleans cannot pass review evidence.

## Evidence

- The validator now returns deterministic type errors for malformed readiness
  and approval fields.
- Target-language audio and media rights still require the actual value `true`.
- Teacher approval and premium-cost policy remain explicit boolean evidence,
  including when they are intentionally `false` during review-only work.
- Runtime behavior covers missing fields and stringified readiness values.
- No provider call, billing, upload, package write, route write, assignment,
  or Z.ai integration is enabled.

This decision is recorded in
`docs/adr/0618-ai-service-strict-readiness-flags.md`.
