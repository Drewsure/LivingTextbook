# Build Session Note: Assignment Rollout Generated Handoff Evidence Link

Date: 2026-08-28

## Slice

Connected generated-package assignment handoff evidence packets into the existing teacher assignment rollout preview.

## Why

Generated package assignment evidence should not create a parallel assignment system. It should enter the same rollout gate used for teacher-reviewed assignments, with evidence ids and policy notes visible before scheduling.

## Guardrails

- No scheduling from handoff evidence.
- No private assignment link activation.
- No class roster binding.
- No progress event stream activation.
- No teacher report export.
- No live classroom launch.
- No raw learner audio or transcript storage.
- No support-language-only handoff.

## Verification

Run:

```powershell
npm run verify:assignment-rollout
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
npm run verify:routes
```
