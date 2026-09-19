# DR-947: Release-Control Evidence In The Acceptance Record Chain

## Decision

Carry the exact release-control evidence from the school policy preflight
through the policy text pack into the future acceptance-record preview.

## Required Invariants

- The binding id, gate, tenant, package version, decision, blockers, and
  approvals remain unchanged across the chain.
- A preview may display evidence but may not accept policy, store terms,
  capture signatures, export evidence, activate storage, or alter release state.
- Missing or malformed inherited evidence remains a visible contract failure,
  not a panel-local fallback.
- Target-language progression, support-language boundaries, premium opt-ins,
  and local/hosted policy gates remain separate and authoritative.

## Evidence

- `apps/web/src/data/sampleSchoolPolicyTextPack.ts`
- `apps/web/src/data/sampleSchoolPolicyAcceptanceRecordPreview.ts`
- `apps/web/src/features/pilot/SchoolPolicyAcceptanceRecordPreviewPanel.tsx`
- `scripts/verify-release-control-readiness.mjs`
