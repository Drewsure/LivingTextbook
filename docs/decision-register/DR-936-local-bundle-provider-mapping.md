# DR-936: Local Bundle Provider Mapping

## Decision

Create a provider-neutral local handoff record and pure mapper before selecting
or enabling a hosted/local handoff provider.

## Required Invariants

- Tenant, bundle, package, and packet identity must be preserved.
- Blocked count must be derived from checks and handoff items.
- Offline readiness is evidence, not activation permission.
- The unconfigured adapter returns no record.
- Reads remain teacher-scoped, review-only, and never student-facing.

## Evidence

- `packages/content-model/src/localBundleHandoffRecord.ts`
- `apps/web/src/server/persistence/localBundleHandoffReviewAdapter.ts`
- `apps/web/src/app/api/persistence/local-handoff/route.ts`
- `scripts/verify-local-bundle-handoff-adapter.mjs`

## Next Gate

Do not implement a real provider until retention, export, backup/restore,
tenant isolation, local fallback, and runtime behavior checks are accepted.
