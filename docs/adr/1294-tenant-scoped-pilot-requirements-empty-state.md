# ADR 1294: Tenant-Scoped Pilot Requirements Empty State

Status: Accepted

## Context

The partner pilot requirements route was useful for the Sample Publisher demonstration but rejected every tenant that did not already have a complete sample intake record. That is not a viable white-label onboarding boundary: a new publisher needs to enter a safe review shell before its source package, rights evidence, school policy, and pilot decisions exist.

## Decision

Resolve `/teacher/pilot/requirements/[tenantId]` through the shared white-label tenant resolver. Render the populated requirements intake only when a tenant-owned record exists. Otherwise render a tenant-scoped empty requirements state with links to review-only upload, source, media, and evidence surfaces.

## Boundaries

- The empty state does not create a requirements record or capture publisher answers.
- Sample Publisher requirements, evidence traces, meeting agenda, follow-up packet, and demo links must not appear for another tenant.
- Upload, storage, extraction, package assembly, policy acceptance, QR printing, persistence, and student launch remain blocked.
- A real requirements packet becomes available only after an authorized publisher submission and review contract are introduced.

## Verification

- The Sample Publisher route continues to render its existing populated review packet.
- `/teacher/pilot/requirements/white-label-review` renders without Sample Publisher records.
- Active route verification and production type/build checks must pass.
