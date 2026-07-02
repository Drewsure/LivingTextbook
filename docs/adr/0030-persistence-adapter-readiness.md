# ADR-0030: Persistence Adapter Readiness

Status: Accepted  
Date: 2026-07-02

## Context

The platform now has visible boundaries for content packages, route registry, launch sessions, progress events, media manifests, report export, deployment profiles, and local bundle manifests. The next risk is choosing or wiring a backend too early.

The product needs a backend-agnostic contract that says what storage must support before a real pilot, while preserving hosted and local deployment options.

## Decision

Add a shared persistence adapter readiness contract and render sample adapter plans in the teacher/admin intake route.

The scaffold includes three adapter modes:

- static demo adapter,
- hosted pilot adapter,
- local classroom adapter.

Each plan lists write intents, deployment channels, store paths, policy requirements, offline capability, export behavior, safety flags, and handoff steps.

## Consequences

Positive:

- Keeps backend choice vendor-neutral.
- Makes hosted PWA and local classroom deployment paths compatible from the start.
- Turns vague persistence needs into explicit write intents.
- Protects core storage from raw learner audio and transcript storage.
- Makes cost posture visible before implementation.

Tradeoffs:

- Adds another scaffold panel to `/teacher/intake`.
- Backend work remains deferred until policy and pilot scope are accepted.
- Future implementation must still map write intents into real migrations, access rules, backup/export behavior, and local sync.

## Verification

Use `docs/verification/PERSISTENCE_ADAPTER_CHECKS.md` and verify:

- `http://127.0.0.1:3000/teacher/intake`

## Related Documents

- `docs/PERSISTENCE_ADAPTER_CONTRACT.md`
- `docs/verification/PERSISTENCE_ADAPTER_CHECKS.md`
- `docs/decision-register/DR-031-persistence-adapter-readiness.md`
