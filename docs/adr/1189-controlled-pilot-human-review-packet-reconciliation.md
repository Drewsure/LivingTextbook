# ADR 1189: Controlled-Pilot Human-Review Packet Reconciliation

## Status

Accepted for foundation hardening.

## Decision

Compare the assist-language audio decision-snapshot binding against the actual
controlled-pilot human-review packet. Packet identity, readiness identity,
tenant, and package scope are required to match.

## Consequences

- Human-review evidence cannot be linked through an intermediate ID alone.
- Cross-tenant and stale-readiness packets fail closed.
- The bridge remains provider-neutral, review-only, and side-effect free.
- Approval, persistence, export, promotion, activation, and student launch are
  still blocked.

## Evidence

- `packages/content-model/src/assistLanguageAudioCatalogReleaseDecisionSnapshotBinding.ts`
- `scripts/verify-assist-language-audio-catalog-release-decision-snapshot-binding.mjs`
