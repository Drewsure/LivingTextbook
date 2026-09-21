# ADR 0931: Package Readiness Source Binding Validation

Status: Accepted for review-only foundation

## Decision

Validate package-readiness reconciliation directly against its referenced
source assembly packet before the reconciliation can be considered internally
consistent.

## Required invariants

- Tenant id must match on the reconciliation and source assembly.
- Package id must match the source assembly target package.
- Source assembly packet id and SHA-256-shaped checksum must match exactly.
- A binding match remains evidence only and cannot authorize storage, release,
  route, assignment, or student-facing behavior.

## Consequence

The publisher intake pipeline can detect stale or substituted source evidence
before later review lanes are assessed. This gives hosted and closed-local
package workflows one provider-neutral scope check.
