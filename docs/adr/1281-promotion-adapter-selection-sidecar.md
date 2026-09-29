# ADR 1281: Promotion Adapter Selection Is an Explicit Review Sidecar

Date: 2026-09-30
Status: Accepted

## Decision

Record the intended package adapter as an immutable, tenant-scoped quarantine
sidecar before a publisher package review packet can become ready for its next
gate. The supported review choices are closed-local, hosted PWA, and hybrid.

The decision is bound to the quarantine identity, package identity, and source
checksum. It is read by admission, package review, readiness binding, and
delivery release lineage. A mismatch or missing record keeps the lineage
blocked.

## Boundary

This is a planning and review record only. It never selects a provider, accepts
school policy, writes a package, prints QR codes, activates hosted persistence,
or enables student-facing use. Those remain separate approvals and feature
gates.

## Consequences

- The package review packet can distinguish complete review metadata from later
  release approval.
- The same adapter choice can be checked against the final delivery manifest.
- A stale UI cannot bypass the server-side custody and lineage checks.
- The frozen Z.ai/Phaser source remains outside this pathway until its evidence
  return package and contract adjudication are complete.
