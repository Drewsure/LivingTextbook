# ADR 1209: Entitlement Runtime Input Boundary

**Status:** Accepted  
**Date:** 2026-09-25

## Context

Optional AI Tutor, microphone, storage, report, and assignment packages are
evaluated through the shared entitlement runtime. Those requests can
eventually cross deployment and persistence boundaries, so malformed runtime
input must be rejected before a provider, browser permission, billing path, or
student-facing feature can be reached.

## Decision

Validate entitlement runtime request identity fields, enum fields, and boolean
policy flags before evaluating a feature. Tenant, package, and entitlement
identifiers must be bounded safe identities. Invalid or non-string identity
values, unsupported feature/state/mode/tier values, and missing policy flags
return deterministic validation errors. The review-only adapter remains
side-effect free and denies activation.

## Consequences

- Malformed requests fail closed without a server exception caused by unsafe
  string operations.
- The same boundary protects optional AI Tutor and speech packages without
  coupling the core classroom package to a provider.
- Review-only status, premium cost gates, school and teacher approvals,
  privacy, persistence, release, audio, and no-raw-audio rules remain required.
- This validates the contract only; it does not enable live AI Tutor, billing,
  microphone capture, persistence, or student assignment.

## Verification

`verify:entitlement-runtime`, the runtime behavior harness, typecheck, build,
and the foundation composition gate must pass.
