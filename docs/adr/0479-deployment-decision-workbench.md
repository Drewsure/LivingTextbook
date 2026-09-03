# ADR 0479: Deployment Decision Workbench

Status: Accepted

Date: 2026-09-03

## Context

The Living Textbook platform is being built as a saleable white-label product, not only as the MiniStar reference curriculum. School and publisher conversations now need a clear answer for hosted PWA, local classroom server, and packaged textbook companion delivery.

The existing `/teacher/intake` page contains the relevant gates, but it is too broad for a focused commercial deployment discussion.

## Decision

Add `/teacher/deployment` as a review-only workbench. The route brings together:

- Deployment decision guide
- Deployment profiles
- PWA and offline readiness
- Media bundle integrity
- Local deployment preflight
- Local bundle manifests
- White-label package catalog

Hosted PWA is the recommended first pilot path. Local classroom server and packaged textbook companion options stay visible but gated.

## Guardrails

- No offline-ready claim.
- No local package activation.
- No installer export.
- No report export.
- No real learner data collection.
- No production QR redirect mutation.
- No student-facing paid prompt.
- No media-only progress.
- No support-language-only progression.
- No premium AI Tutor activation.

## Verification

- `npm.cmd run verify:deployment`
- `npm.cmd run verify:review-keys`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`
