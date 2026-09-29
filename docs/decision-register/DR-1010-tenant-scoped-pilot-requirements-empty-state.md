# DR-1010: Tenant-Scoped Pilot Requirements Empty State

Status: Accepted

Decision: New white-label tenants receive a safe, review-only pilot requirements shell before a publisher-owned requirements packet exists.

Rationale:

- A saleable platform must begin onboarding from a tenant boundary, not from a MiniStar or Sample Publisher fixture.
- The first route should make the next evidence steps visible without pretending that content, rights, policy, or deployment decisions have been supplied.
- Keeping the shell review-only preserves the current fail-closed posture while making the partner workflow navigable.

Consequences:

- The requirements route resolves any safe tenant identifier and renders an explicit empty state when no tenant packet exists.
- Sample Publisher records remain visible only on the Sample Publisher route.
- This improves white-label readiness but does not advance the pilot acceptance matrix from review-only or blocked status.
- Live intake, persistence, QR printing, package release, and student launch still require later evidence and human approval.
