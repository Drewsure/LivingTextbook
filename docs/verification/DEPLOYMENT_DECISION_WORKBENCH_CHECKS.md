# Deployment Decision Workbench Checks

Document type: verification checklist  
Status: active scaffold  
Last updated: 2026-09-03

## Purpose

Protect the focused `/teacher/deployment` route as a review-only commercial deployment planning surface.

## Required Checks

- The route exists at `http://127.0.0.1:3000/teacher/deployment`.
- The route shows `Deployment decision workbench`.
- The route compares `Hosted PWA first pilot`, `Local classroom server pilot`, and `Packaged textbook companion`.
- Hosted PWA is the recommended first pilot path for cost control.
- Local classroom server and packaged companion options remain gated.
- The route renders deployment profiles, PWA/offline readiness, media bundle integrity, local deployment preflight, local bundle manifests, and white-label package catalog panels.
- The route links to `/teacher/intake`, `/teacher/persistence`, `/teacher/entitlements`, `/local/sample-publisher`, and `/local/ministar`.
- The active route verifier expects 87 active routes.

## Must Stay Blocked

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

## Command

Run:

```powershell
npm run verify:deployment
```
