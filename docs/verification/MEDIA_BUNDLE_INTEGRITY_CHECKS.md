# Media Bundle Integrity Checks

Status: Active foundation check

## Purpose

Keep audio, music, video, poster, image, and future game asset bundles practical, verifiable, rights-safe, and updateable before local/offline product delivery.

## Required Surface

`/teacher/intake`, `/local/ministar`, and `/local/sample-publisher` must show:

- Media bundle integrity readiness
- Media package engineering gate
- Bundle size budget
- Checksum manifest
- Duplicate media detection
- Streaming/local fallback
- Yearly edition replacement
- Learning audio priority preserved
- Asset rights proof first
- No package-size approval
- No checksum-free bundle
- No direct folder activation
- No uncompressed video handoff
- No media-only progress
- No background music overriding learning audio
- No local installer export

## Standing Rule

No local/offline media bundle is allowed until size budgets, checksums, rights proof, duplicate strategy, fallback behavior, yearly replacement policy, and learning-audio priority are reviewed together.

## Verification

Run:

```powershell
npm.cmd run verify:local-bundle
npm.cmd run verify:review-keys
npm.cmd run typecheck --workspace @living-textbook/web
npm.cmd run build --workspace @living-textbook/web
npm.cmd run verify:routes
```
