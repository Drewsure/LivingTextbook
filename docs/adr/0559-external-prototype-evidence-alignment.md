# ADR-0559: External Prototype Evidence Alignment

Status: Accepted  
Date: 2026-09-11

## Decision

Treat the returned external-prototype evidence chain as one aligned review
packet. The return review, integration plan, wrapper adapter review, fixture
replay, event replay, audio coverage, mobile accessibility, scoring replay,
Codex integration decision, and integration-readiness gate must share the same
tenant and request. The plan and downstream reports must also point to the
same review and plan IDs, with identical mode and parent-engine coverage.

## Why

Each evidence document has its own validator, but independent validity cannot
prove that the documents describe the same candidate. Alignment catches drift
before a future wrapper review or app patch can accidentally combine evidence
from different tenants, requests, or game families.

## Guardrails

- Duplicate, missing, unexpected, or parent-engine-mismatched modes block the
  packet.
- The check is read-only and vendor-neutral.
- It does not authorize source import, route replacement, scoring mutation,
  package promotion, or student assignment.
- Z.ai and Phaser work remain quarantined until the separate Codex integration
  decision is accepted.

## Verification

The shared validator is `packages/content-model/src/aiPrototypeEvidenceAlignment.ts`.
The review-only sample packet and workbench are wired through
`apps/web/src/data/sampleAiPrototypeEvidenceAlignment.ts` and
`apps/web/src/features/content-intake/AiPrototypeEvidenceAlignmentPanel.tsx`.

Run `npm run verify:foundation` after changes.
