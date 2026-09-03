# 2026-09-03: Deployment Decision Workbench

## Build Slice

Added a focused `/teacher/deployment` workbench for hosted PWA, local classroom server, and packaged textbook companion decisions.

## Why

The white-label product needs a readable deployment path for school and publisher conversations. Hosted PWA is the lowest-cost first pilot route, while local classroom server and packaged companion options remain important but gated.

## Guardrails

- No offline-ready claim.
- No local package activation.
- No installer export.
- No report export.
- No real learner data collection.
- No production QR redirect mutation.
- No student-facing paid feature prompt.
- No media-only progress.
- No support-language-only progression.
- No premium AI Tutor activation.

## Verification

- `npm.cmd run verify:deployment`
- `npm.cmd run verify:review-keys`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`
