# 2026-08-25 Build Session: AI Generation Request Packet Storage

## Summary

Added the backend-neutral storage contract for AI generation request packets. This makes the request storage guard enforceable across schema drafts, migration candidates, migration specs, hosted/local adapters, durable record planning, route visibility, and verifier checks.

## Rule Added

The AI generator cannot move from disabled request preview into live model dispatch, model billing, draft generation, verifier submission, generated package assembly, route writes, playlist writes, assignments, student-ready markers, or support-language progress until a durable request packet and downstream gates exist.

## Files Updated

- `packages/content-model/src/persistenceRecords.ts`
- `packages/content-model/src/persistenceAdapter.ts`
- `apps/web/src/data/samplePersistencePlan.ts`
- `apps/web/src/data/samplePersistenceAdapterPlan.ts`
- `apps/web/src/data/sampleBackendSchemaDraft.ts`
- `apps/web/src/data/sampleBackendMigrationCandidates.ts`
- `apps/web/src/data/sampleBackendMigrationSpecs.ts`
- `scripts/verify-backend-storage-readiness.mjs`
- `scripts/verify-active-routes.mjs`
- `docs/DECISION_REGISTER.md`
- `docs/decision-register/DR-505-ai-generation-request-packet-storage-contract.md`
- `docs/adr/0434-ai-generation-request-packet-storage-contract.md`

## Next Step

Continue strengthening the generator evidence flow before adding any live provider/model integration.
