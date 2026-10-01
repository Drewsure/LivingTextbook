# DR-1368: Complete Deployment Verifier Fixture

- Status: accepted
- Date: 2026-10-01
- Scope: pilot deployment configuration preflight

## Decision

The deployment configuration verifier must provision every required synthetic
custody root, including `LIVING_TEXTBOOOK_LOCAL_BUNDLE_MANIFEST_REVIEW_ROOT`,
before asserting that the complete hosted, closed-local, and hybrid matrix is
ready for operator review.

## Why

The production configuration contract already checked the reviewed local
bundle-manifest root, but the verifier fixture omitted it. The full foundation
suite therefore reported a false deployment failure even though the runtime
contract was correct.

## Guardrails

- The verifier still starts with an entirely unset environment and expects a
  blocked result.
- Synthetic roots are temporary and never become deployment configuration.
- Secret values remain absent from all output.
- Readiness remains review-only and does not enable writes or student use.
