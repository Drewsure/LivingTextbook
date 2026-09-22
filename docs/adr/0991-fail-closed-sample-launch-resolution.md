# ADR 0991: Fail-Closed Sample Launch Resolution

## Decision

The sample launch resolver accepts only exact launch codes that are explicitly
bound to a reviewed tenant and content package. Unknown codes fail closed with
a not-found response.

## Why

The previous prefix/default behavior could make an unregistered QR or guessed
URL inherit MiniStar or sample-publisher content. That is unsafe for a
white-label platform because tenant identity, package content, audio cues,
progression, rewards, and teacher reporting must travel together.

## Constraints

- This is a sample/demo boundary, not a production route registry.
- No QR mutation, storage write, assignment, or student launch is enabled.
- Prefix matching is not an authorization mechanism.
- Future production resolution must use a tenant-scoped route registry with
  release state, alias, rollback, local fallback, and authorization evidence.

## Evidence

- `apps/web/src/data/sampleLaunchResolver.ts`
- `docs/FUTURE_REQUIREMENTS.md` FR-022
- `docs/decision-register/DR-1063-fail-closed-sample-launch-resolution.md`
