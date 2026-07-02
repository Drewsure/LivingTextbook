# DR-031: Persistence Adapter Readiness

Status: Accepted  
Date: 2026-07-02

## Decision

Define a backend-agnostic persistence adapter readiness contract before choosing a database, local store, or storage vendor.

## White-Label Impact

Strongly positive. Hosted schools, installed PWAs, local classroom servers, and closed textbook companion apps can share the same storage expectations without hard-coding one vendor or deployment style.

## Cost Impact

Positive. The hosted pilot adapter remains the recommended first path because it is cheaper and faster than local installer/sync work. The local classroom adapter remains visible so the product does not paint itself into a cloud-only corner.

## Constraints

- No backend vendor is selected by this decision.
- Core storage must reject raw learner audio.
- Core storage must reject learner transcripts.
- Student-data writes require school or tenant policy.
- Report export remains policy-gated.
- Media/object storage must remain separate from student progress storage.
- Local deployment must remain compatible with hosted pilot architecture.

## Verification

Use `docs/verification/PERSISTENCE_ADAPTER_CHECKS.md` and verify:

- `http://127.0.0.1:3000/teacher/intake`

## Related Files

- `packages/content-model/src/persistenceAdapter.ts`
- `apps/web/src/data/samplePersistenceAdapterPlan.ts`
- `apps/web/src/features/persistence/PersistenceAdapterReadinessPanel.tsx`
- `docs/adr/0030-persistence-adapter-readiness.md`
