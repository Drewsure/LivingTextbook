# DR-1013: Fresh-Tenant Publisher Intake Rehearsal

Status: Accepted

Decision: The publisher intake rehearsal must use a fresh synthetic tenant and
must prove that the tenant's upload workspace is empty and reference-record
isolated before any source is submitted.

Rationale:

- White-label custody is not demonstrated by a populated reference tenant.
- A new publisher needs the same platform channel policy without seeing
  another tenant's source, evidence, assets, or package records.
- Reusing the existing review-only flow keeps the verification valuable without
  authorizing live storage, package assembly, QR printing, or student launch.

Consequences:

- The rehearsal now covers tenant isolation and the complete review-only intake
  progression in one deterministic run.
- Sample Publisher remains available as a populated reference tenant only.
- Release, persistence activation, and student-facing use remain blocked until
  separate production evidence and human approval exist.
