# DR-1012: Tenant-Safe Publisher Upload Boundary

Status: Accepted

Decision: Generic white-label tenants receive tenant-owned quarantine intake and platform upload policy, never populated Sample Publisher or MiniStar review records.

Rationale:

- A publisher must be able to provide source and multimedia content without inheriting another tenant's evidence.
- The actual upload channel contract is useful before a complete package exists, but its records must remain tenant-scoped.
- Keeping quarantine opt-in and fail-closed preserves the current safety boundary while making the eventual saleable intake path real.

Consequences:

- The generic route can accept an explicitly enabled quarantine submission for the requested tenant.
- Sample Publisher remains the reference workspace for populated review fixtures.
- The pilot is still review-only until a real submission closes scan, rights, source, package, delivery, and release evidence.
