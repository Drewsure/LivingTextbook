# Source-Review Quarantine Bridge Checks

## Purpose

Confirm that source review visibly hands a publisher into the tenant-bound
quarantine review contract without widening data or activation permissions.

## Checks

- The source-review workspace renders `QuarantineMetadataReviewPanel`.
- The panel exposes authorized review, evidence preview, package handoff, and
  readiness binding contracts.
- The bridge remains metadata-only and states that raw payloads, download URLs,
  promotion, and student use are blocked.
- An admitted quarantine identity can be carried into the source-review page,
  which exposes metadata, evidence, and package-handoff links.
- Known tenant routes and the generic white-label route build and return `200`.

## Commands

```powershell
npm run verify:source-review
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web -- --webpack
npm run verify:routes:preview
```
