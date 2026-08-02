# DR-335: AI Prototype App Patch Proposal Preview

## Decision

The platform will show review-only AI prototype app patch proposal previews before any generated or externally returned prototype can create app file changes.

## Rationale

The safest next step after Codex decision and readiness-gate planning is not live patch generation. It is a visible proposal surface that names file scope, wrapper boundaries, fixture-only data paths, route preview scope, required test gates, and blocked side effects.

## Implementation Notes

- `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` now include the app patch proposal preview.
- The preview names wrapper-only, fixture-only, route-preview, and test-only future patch scopes.
- Required gates include `codex_integration_review_decision`, `ai_prototype_integration_readiness_gate`, `reviewer_identity_signature_gate`, and `package_publish_gate`.
- App file writes, generated route writes, student-facing routes, scoring or reward mutation, audio manifest mutation, package promotion, and assignments remain blocked.
- MiniStar proposals also block Japanese support-language triggers.

## Follow-Up

Completed by `DR-347-ai-prototype-app-patch-proposal-storage-contract.md`: app patch proposals now have a backend-neutral storage contract after the preview shape stabilized.
