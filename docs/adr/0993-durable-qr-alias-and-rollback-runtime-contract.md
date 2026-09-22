# ADR 0993: Durable QR Alias And Rollback Runtime Contract

## Decision

Use one provider-neutral QR alias runtime request and rollback evidence shape
for hosted, local, and hybrid deployments. Keep the adapter review-only until
durable persistence, release approval, local fallback, authorization, and
rollback execution evidence are complete.

## Why

Printed textbook QR codes outlive individual app deployments and package
versions. A stable alias needs explicit release lineage and a safe fallback so
an update or rights problem cannot silently send learners to the wrong tenant,
edition, file, or package.

## Boundary

The runtime validator is evidence only. Its adapter always returns `allowed:
false` and `sideEffect: "none"`; it cannot write aliases, redirects, routes,
packages, local bundles, learner data, or rollback state.

## Evidence

- `packages/content-model/src/qrAliasRuntime.ts`
- `apps/web/src/data/sampleQrAliasRollbackEvidence.ts`
- `scripts/verify-qr-alias-rollback-boundary.mjs`
- `docs/verification/QR_ALIAS_ROLLBACK_BOUNDARY_CHECKS.md`
