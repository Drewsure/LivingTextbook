# ADR 0477: Local Preview Offline Readiness Parity

Status: Accepted

Date: 2026-09-03

## Context

The foundation build now has a central PWA/offline readiness gate on `/teacher/intake`. The local companion preview routes are the most likely surfaces to be shown during discussions about closed textbook companion delivery.

If those routes do not show the same promise boundary, a partner could mistake a local preview for an offline-ready installer or media package.

## Decision

Render the shared PWA/offline readiness gate on:

- `/local/ministar`
- `/local/sample-publisher`

## Guardrails

- Local preview routes remain planning surfaces, not exporters or installers.
- The preview cannot register service workers, mutate caches, precache media, activate local packages, store learner data, run background sync, mutate production QR aliases, or export reports.
- Active route verification must protect the PWA/offline markers on both local preview routes.

## Verification

- `npm.cmd run verify:local-bundle`
- `npm.cmd run verify:review-keys`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`
