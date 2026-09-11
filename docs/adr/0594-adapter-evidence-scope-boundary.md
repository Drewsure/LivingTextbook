# ADR-0594: Adapter Evidence Scope Boundary

Status: Accepted

## Decision

Hosted and local evidence-packet and evidence-attachment write intents must
declare the same explicit scope_kind as their durable record: platform or
tenant.

The adapter validator rejects missing scope, and the cross-layer alignment
validator rejects a mismatch between the durable record and the write intent.

## Why

The schema boundary is not enough by itself. A future hosted or closed/local
adapter could otherwise omit ownership scope while still appearing to support
the correct record type. This would weaken tenant isolation and make exports
ambiguous.

## Guardrails

- Scope alignment does not authorize live writes.
- Upload, approval, promotion, download, and student-facing use remain
  separately blocked.
- Hosted and local plans use the same scope vocabulary.
- Tenant-specific adapters must declare their scope intentionally; they may not
  inherit a platform default silently.

## Consequences

Backend vendor selection and storage implementation must preserve scope_kind end
to end. The foundation can prove this before any real storage API, upload
control, or package promotion workflow is enabled.
