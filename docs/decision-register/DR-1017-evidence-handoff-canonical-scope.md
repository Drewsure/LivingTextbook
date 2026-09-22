# DR-1017: Evidence Handoff Canonical Scope

The teacher evidence-packet handoff now binds to the canonical pilot package
and tenant. A stable route key remains separate from package scope. The shared
contract rejects missing identity, duplicate sections or recipients, external
source routes, incomplete evidence statements, and missing export/publish
blockers.

Evidence:

- `packages/content-model/src/evidencePacketHandoff.ts`
- `apps/web/src/data/sampleEvidencePacketHandoffPackage.ts`
- `apps/web/src/features/evidence/EvidencePacketHandoffPanel.tsx`
- `scripts/verify-evidence-handoff-scope.mjs`
