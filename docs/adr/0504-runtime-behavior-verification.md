# ADR-0504: Runtime Behavior Verification

Status: Accepted

## Decision

Add a deterministic Node-based behavior harness that compiles and exercises shared TypeScript runtime contracts as part of foundation verification.

## Required cases

The harness rejects support-only progression, random reward generation, unsafe learner-media recovery, and core-tier AI Tutor activation. It also verifies a review-only progression result returns `sideEffect: "none"`.

## Guardrails

- The harness is local and provider-neutral.
- It does not call AI, storage, media, microphone, QR, reward, assignment, or classroom providers.
- It tests the compiled shared contracts rather than reimplementing their decisions.

## Verification

Run `npm run verify:runtime-behavior`, `npm run verify:foundation-composition`, typechecks, production build, and full foundation verification.
