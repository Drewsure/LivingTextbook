# ADR 1188: Upstream Release-Review Identity Reconciliation

## Status

Accepted for foundation hardening.

## Decision

The assist-language audio decision-snapshot binding must be compared against
the actual upstream release-review binding. Required IDs are not enough when
the values can drift between records.

The comparison covers the release-review binding ID, reconciliation,
reviewer-gate, controlled human-review packet, release-readiness,
release-control, approval-ledger, tenant, package, and unit identities.

## Consequences

- Cross-record lineage is explicit and testable.
- Tampered reviewer or human-review identities fail closed before release
  evidence is presented as linked.
- The validator remains provider-neutral and review-only.
- Approval, promotion, persistence, export, activation, and student launch are
  still blocked.

## Evidence

- `packages/content-model/src/assistLanguageAudioCatalogReleaseDecisionSnapshotBinding.ts`
- `scripts/verify-assist-language-audio-catalog-release-decision-snapshot-binding.mjs`
