# ADR 1295: Tenant-Scoped Pilot Command Shell

Status: Accepted

## Context

The existing `/teacher/pilot` route is a populated Sample Publisher readiness dashboard. A new publisher entering its own requirements route must not be returned to that sample command view, because it would blur tenant ownership and imply that sample evidence belongs to the publisher.

## Decision

Add `/teacher/pilot/[tenantId]` as the tenant-scoped pilot command shell. The Sample Publisher tenant redirects to the existing reference dashboard. Other safe tenants receive a review-only shell linking to their own requirements, intake, evidence, and media routes.

## Boundaries

- The shell does not create a pilot packet, accept files, write storage, assemble a package, print QR codes, enable persistence, activate local delivery, or launch students.
- Sample Publisher data remains on the reference dashboard only.
- Unknown or unsafe tenant identifiers return not found.
- A populated tenant dashboard requires tenant-owned source, rights, package, and release evidence later.

## Verification

- `/teacher/pilot/white-label-review` returns 200 and contains only the generic review shell.
- `/teacher/pilot/requirements/white-label-review` links back to the tenant-scoped shell.
- The Sample Publisher dashboard remains available at `/teacher/pilot`.
