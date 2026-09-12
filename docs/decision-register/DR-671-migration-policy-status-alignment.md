# DR-671: Migration Policy Status Alignment

Status: Accepted

## Decision

Migration specifications for `needs-policy` candidates must be
`blocked-by-policy`, not `ready-for-review`.

## Rationale

- Candidate and spec statuses must tell the same readiness story.
- A storage contract must not appear ready while its governing policy is
  unresolved.
- Hosted and closed/local implementation planning needs one clear gate.

## Guardrails

- This does not enable live persistence or select a backend vendor.
- Release control, upload, approval, promotion, and student-facing use remain
  behind their existing gates.

## Evidence

- The package release-candidate sample is now explicitly blocked by policy.
- Regression coverage rejects a ready-for-review spec for candidate `m005`.

This decision is recorded in
`docs/adr/0599-migration-policy-status-alignment.md`.
