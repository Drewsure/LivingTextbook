# ADR 1225: Persistence Provider Verification Command Surface

**Status:** Accepted  
**Date:** 2026-09-29

## Context

The provider configuration and selection-preflight verifiers existed as
standalone scripts, but the root package did not expose all of them as npm
commands. A publisher or pilot operator following the documented workflow
could therefore receive a misleading missing-script failure, and the broad
persistence runtime gate could omit important provider-neutral checks.

## Decision

Expose provider configuration, provider selection preflight, selection
behavior, and durable-write activation preflight through named root npm
commands. Run the same checks from `npm run verify:persistence-runtime`.

These checks remain fail-closed and review-only. They must not select a vendor,
migrate data, enable durable writes, or activate hosted persistence.

## Consequences

- Pilot verification is reproducible from the repository root.
- Provider comparison and activation boundaries are covered by the persistence
  runtime gate.
- A human still must supply deployment, school-policy, privacy, and provider
  approval evidence before activation can become eligible.

## Verification

Run `npm run verify:persistence-runtime`,
`npm run verify:persistence-provider-selection-preflight`, and
`npm run verify:persistence-activation-preflight`.
