# Private Tenant Library Contract

Document type: foundation product contract

Related:

- `docs/COMPETITIVE_FEATURE_COVERAGE_MATRIX.md`
- `docs/PACKAGE_RELEASE_VERSIONING_CONTRACT.md`
- `docs/PACKAGE_APPROVAL_LEDGER_CONTRACT.md`

## Purpose

Private tenant libraries are the first practical answer to community-resource expectations.

The platform should let teachers, schools, and publishers reuse reviewed resources inside a tenant before any public community marketplace exists.

## Current Sample

Sample data:

- `apps/web/src/data/sampleTenantLibraryPlan.ts`

Panel:

- `apps/web/src/features/publisher/TenantLibraryPlanPanel.tsx`
- `apps/web/src/features/publisher/TeacherPrivateLibraryPanel.tsx`

Route:

- `/teacher/intake`
- `/teacher/library/sample-publisher`

Verifier:

- `npm run verify:tenant-library`

## Build Order

1. Teacher private drafts.
2. Tenant-approved package library.
3. School shared library inside the same tenant.
4. Public community only after governance exists.

## Current Stage Decisions

Planned:

- Teacher private drafts
- Tenant-approved package library
- School shared library

Blocked:

- Public community library

## Standing Rules

- Public community library is blocked for v1.
- Private drafts cannot be assigned to students.
- AI drafts require review before entering the library.
- Library sharing must not copy student data, report exports, recordings, or identities.
- Copied resources must preserve source package, edition, version, media rights, and owner lineage.
- Tenant-approved libraries require durable package approval and version records.
- Cross-tenant/public sharing requires moderation, copyright review, privacy policy, quality review, tenant isolation, and abuse reporting.

## Follow-Up

Promote the library plan into durable records after authentication, ownership, package versioning, and persistence are selected.
