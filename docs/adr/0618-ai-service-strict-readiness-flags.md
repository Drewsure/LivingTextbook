# ADR-0618: AI-Service Strict Readiness Flags

Status: Accepted

## Decision

The provider-neutral AI service must accept readiness and approval fields only as
actual booleans. External JSON values such as `"true"`, `"false"`, `1`, and `0`
must not satisfy target-language audio, media-rights, teacher-approval, or
premium-cost policy gates.

## Required behavior

- `targetLanguageAudioReady` must be a boolean and must be `true` for audio readiness.
- `mediaRightsReady` must be a boolean and must be `true` for media-rights readiness.
- `teacherApprovalReady` and `premiumCostPolicyReady` must be booleans even when `false` keeps the request review-only.
- Malformed values return deterministic validation errors and never reach a provider adapter.

## Guardrails

This remains a validation-only boundary. It does not call a provider, charge a
provider, write a package, activate a route, or enable Z.ai/game integration.

## Verification

Run `npm run verify:ai-service`,
`npm run typecheck --workspace @living-textbook/ai-service`,
`npm run verify:runtime-behavior`, and `npm run verify:foundation`.
