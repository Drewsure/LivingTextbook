# ADR 0983: Package-Readiness Lineage Visibility

## Decision

Show the exact source assembly packet, structured extraction preview identity,
and source checksum on the teacher package-readiness and persistence-preview
surfaces.

## Boundaries

- The cards remain review-only and provider-neutral.
- Visible lineage cannot authorize upload, storage, package promotion, route or
  playlist creation, assignment, or student access.
- Tenant and package labels remain adjacent to the references so operators can
  detect cross-tenant evidence drift.

## Rationale

An evidence count is not sufficient for a saleable white-label platform. A
teacher or publisher operator must be able to audit the exact source chain
without opening implementation details or mistaking a preview for activation.

Evidence: `apps/web/src/features/content-intake/PackageReadinessReconciliationPanel.tsx`,
`apps/web/src/features/persistence/PackageReadinessPersistencePanel.tsx`, and
the package-readiness verification scripts.
