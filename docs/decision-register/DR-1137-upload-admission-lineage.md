# DR-1137: Upload Admission Lineage Into Evidence Handoff

## Decision

Connect upload quarantine admission previews to the tenant evidence handoff
through a shared, exact-identity binding contract.

## Rationale

Generic packet names were not sufficient to trace a specific upload admission
through review. Exact lineage makes human review auditable while preserving the
existing review-only safety boundary.

## Guardrails

- Tenant, package, source, quarantine, admission, evidence-packet, decision,
  and blocker identity must travel together.
- Promotion and student use remain false; mode remains review-only and side
  effect remains none.
- Handoff presence cannot authorize export, approval, storage, promotion,
  assignment, QR mutation, local activation, or student-facing use.

## Evidence

The shared binding validator, sample handoff package, handoff panel, focused
verifiers, and full foundation gate provide the implementation evidence.
