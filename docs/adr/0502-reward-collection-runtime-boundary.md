# ADR-0502: Reward And Collection Runtime Boundary

Status: Accepted

## Decision

Add a provider-neutral reward runtime request/result contract and review-only adapter between accepted progression evidence and future collection inventory or reward providers.

## Required checks

The runtime validates tenant/package/pseudonymous learner scope, reward identity and kind, source event, earned mastery, deterministic rule, ownership provenance, reward policy, persistence, and release approval.

## Guardrails

- Random rewards, generated gacha, purchase-required unlocks, reward-driven progression bypasses, direct inventory writes, and reward ownership mutation remain blocked.
- Spin Wheel ticket issuance requires separate approved policy evidence.
- Review-only execution always returns `sideEffect: "none"`.

## Verification

Run `npm run verify:reward-runtime`, `npm run verify:foundation-composition`, typechecks, production build, and full foundation verification.
