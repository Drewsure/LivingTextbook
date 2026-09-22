# Teacher Draft Persistence Implementation Storage Checks

## Purpose

This check verifies that the provider-neutral teacher draft persistence implementation-readiness packet has a durable schema and migration boundary without activating a persistence provider.

## Required assertions

- `teacher_draft_persistence_implementation_readiness` is tenant-scoped, draft-scoped, owner-scoped, and policy-revision-scoped.
- The record preserves the nine acceptance tests: tenant isolation, draft lineage, owner/policy binding, deterministic idempotent save, raw audio/transcript exclusion, retention/export/deletion, hosted/local parity, rollback/recovery, and assignment/promotion guards.
- Hosted and local adapter plans carry the same readiness boundary and remain policy-required rather than pilot-ready.
- Provider selection, implementation, migration, live writes, uploads, route mutation, live test execution, and assignment promotion remain blocked.
- Schema and migration specifications do not contain provider credentials, raw learner audio, learner transcripts, or automatic migration commands.
- Storing or exporting readiness evidence does not mutate a draft, route, package release, or assignment.

## Verification

Run:

```powershell
npm run verify:backend-storage
npm run verify:runtime-behavior
npm run typecheck --workspace @living-textbook/web
```

The backend readiness verifier must report the new schema entity, migration candidate, and migration specification without selecting a provider.
