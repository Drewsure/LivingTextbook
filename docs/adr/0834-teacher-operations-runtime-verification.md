# ADR 0834: Teacher Operations Runtime Verification

## Status

Accepted for foundation hardening.

## Context

Source checks proved the intended teacher operations boundary, but a
multi-tenant white-label platform also needs runtime evidence that cookies,
tenant queries, and unauthorized response shapes behave correctly together.

## Decision

Add an opt-in Node runtime verifier that signs into an explicitly configured
test deployment, checks same-tenant access, checks cross-tenant rejection, and
asserts that unauthorized responses do not disclose provider data. Accept an
optional second deployment URL for existing-cookie revocation checks.

## Consequences

- Authorization regressions can be caught at the HTTP boundary before pilot
  review.
- The default foundation command remains credential-free and deterministic.
- The verifier remains read-only and cannot establish production readiness by
  itself; it must be combined with build, route, privacy, and deployment gates.
