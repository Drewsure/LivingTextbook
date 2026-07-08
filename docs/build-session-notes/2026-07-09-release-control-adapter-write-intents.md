# Build Session Note: Release Control Adapter Write Intents

Date: 2026-07-09

## Session Fit

This belongs to Sessions 3, 6, and 7 because it keeps package release control backend-agnostic while making it part of hosted and local pilot storage planning.

It is foundation work. It does not choose a backend vendor and does not implement production writes.

## Added

- Hosted pilot write intents for package publish gates and approval ledgers.
- Local classroom write intents for local package publish gates and local approval ledgers.
- Updated persistence adapter contract.
- Updated persistence adapter verification checks.
- ADR and focused decision-register entry.

## Product Rule Reinforced

Release control must travel with the storage architecture. A backend that can store student events but cannot store publish gates and approval ledgers is not sufficient for a real white-label partner pilot.

## Local Verification

Pull latest `legacy-source-import`, run typecheck/build, then verify:

- `http://127.0.0.1:3000/teacher/intake`

Use:

- `docs/verification/PERSISTENCE_ADAPTER_CHECKS.md`
