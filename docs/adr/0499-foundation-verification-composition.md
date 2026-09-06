# ADR-0499: Foundation Verification Composition

Status: Accepted

## Decision

Make `verify:foundation` the complete contract gate for the provider-neutral backend/runtime chain and the web release surface. Add a small composition verifier that checks the required focused commands remain present.

## Required checks

The canonical command includes AI service and persistence runtime verification, report, asset/media, content-package, classroom-launch, assignment, source-intake, and release-runtime verification, AI service typecheck, web typecheck, the production webpack build, and active route verification.

## Guardrails

- Focused verifiers remain independently runnable for diagnosis.
- The composition verifier checks command coverage but does not authorize providers or mutate application state.
- No backend choice, storage write, release mutation, route activation, or student data collection is enabled.

## Verification

Run `npm run verify:foundation-composition`, `npm run verify:ai-service`, `npm run verify:persistence-runtime`, typecheck, production build, and full foundation verification.
