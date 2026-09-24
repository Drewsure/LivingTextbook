# ADR 1185: Assist-Language Audio Decision Snapshot Adjudication

## Status

Accepted for foundation scaffolding; production approval remains blocked.

## Decision

Link the assist-language audio composite release-review binding to the exact
provider-neutral pilot review decision snapshot. Preserve the snapshot ID,
decision ID, tenant/package scope, persistence mode, release-control identity,
approval-ledger identity, and decision fingerprint in one review-only record.

## Boundaries

- The bridge must be tenant- and package-scoped.
- A missing, invalid, or mismatched snapshot produces visible scope drift or a
  blocking reason.
- Snapshot write, restore, export, approval capture, production approval,
  package promotion, release activation, and student launch remain disabled.
- This bridge is evidence adjudication, not a durable writer or approval
  workflow.

## Verification

`verify:assist-language-audio-catalog-release-decision-snapshot-binding`
validates deterministic identity, fingerprint carriage, required record links,
tenant scope, and review-only action blocks.
