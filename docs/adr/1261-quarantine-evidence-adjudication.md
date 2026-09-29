# ADR 1261: Quarantine Evidence Adjudication

Date: 2026-09-29
Status: Accepted

## Decision

The first saleable white-label pilot records publisher evidence adjudication
as an immutable metadata-only sidecar beside each quarantined source or media
asset. The record captures scan, rights, source review, target mapping,
accessibility, reviewer, note, and release recommendation fields. It is
written only when `LIVING_TEXTBOOOK_EVIDENCE_REVIEWS_ENABLED=true` and the
request is tenant-authorized.

The live package preview and readiness routes consume this validated record.
An evidence-complete record can make the intake admission `evidence-ready`,
but it cannot authorize assembly, promotion, QR printing, hosted persistence,
or student access. Promotion-adapter selection and release/delivery approval
remain separate gates.

## Consequences

- The publisher pilot has a real place to record human review without
  pretending that an uploaded file is already a saleable package.
- Review records are bounded and safe to display in teacher handoff views.
- The closed-local fallback remains possible without hosted credentials.
- Future storage or evidence providers must preserve this contract and cannot
  bypass the shared route-level admission checks.
- The pilot still requires human completion of rights and release decisions;
  automated verification is not a substitute for that adjudication.
