# DR-253 School Policy Acceptance Preflight

Date: 2026-07-16

## Decision

Add a review-only school policy acceptance preflight before any future accept button, signature capture, evidence export, storage activation, or school launch workflow exists.

## Rationale

White-label school adoption requires explicit policy proof. A future acceptance must be tied to a known school approver, tenant, school, release candidate, handoff packet version, policy text version, learner-data policy, storage policy, support-language rules, microphone/AI Tutor opt-ins, rollback plan, and revocation path. Showing these requirements now keeps the build honest without prematurely enabling live workflows.

## Guardrails

- No accept button.
- No policy acceptance workflow.
- No signed approval capture.
- No evidence export.
- No storage activation.
- No assignment creation.
- No release-state mutation.
- No launch-ready status.
- No production QR promise.
- No real learner data collection.
- No teacher report export.
- No AI Tutor activation.
- No support-language-only progression.
- No live classroom workflow.

## Verification

- `npm run verify:release-control`
- `npm run verify:foundation`
