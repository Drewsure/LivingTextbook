# ADR-0501: Progression Event Runtime Boundary

Status: Accepted

## Decision

Add a provider-neutral progression runtime request/result contract and review-only adapter around the shared progress-event envelope and taxonomy.

## Required checks

The runtime validates tenant/package/session scope, taxonomy classification, settings context, progression policy, persistence readiness, report runtime readiness, deterministic reward policy, and target-language evidence for progress-affecting events.

## Guardrails

- Support-only events cannot enter the progression authority.
- Report-only events cannot mutate mastery, scores, rewards, unlocks, or learner progress.
- Review-only execution always returns `sideEffect: "none"`.
- Hosted managed, local classroom, and hybrid progression providers use the same contract.

## Verification

Run `npm run verify:progression-runtime`, `npm run verify:foundation-composition`, typechecks, production build, and full foundation verification.
