# DR-553: Partner Pilot Evidence Traceability

Status: Accepted

## Decision

The partner pilot requirements intake must include a review-only evidence traceability map. Each trace item links a pilot requirement to the route that currently holds its proof or blocker, plus the current signal, blocked-until condition, and pilot dependency.

## Rationale

White-label partner conversations need more than a checklist. They need a visible chain from publisher supplies and school decisions to the platform evidence routes that already exist. This keeps sales, onboarding, media rights, policy, reporting, deployment, premium AI, and outside prototype discussions grounded in the same foundation system.

## Guardrails

- No partner answer capture.
- No live upload or file picker.
- No policy acceptance.
- No storage write.
- No report export.
- No route mutation.
- No package activation.
- No classroom launch.
- No premium AI Tutor activation.
- No Z.ai or outside prototype handoff request.

## Verification

- `npm run verify:pilot-requirements`
- `npm run verify:routes`
- `npm run verify:foundation`
