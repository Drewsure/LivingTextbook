# DR-023: Reviewed Content Intake Scaffold

Status: Accepted

Date: 2026-07-01

## Decision

Add a teacher/admin content intake scaffold for reviewed source-to-package workflows before building automated PDF/DOCX extraction or production persistence.

## Rationale

White-label partners will bring textbook files and media assets. The platform must accept those sources without treating raw extraction, AI drafts, or placeholder media as student-ready content.

## Accepted Scope

- Add sample content intake runs for MiniStar and Sample Publisher.
- Add a teacher/admin review route at `/teacher/intake`.
- Show review gates for source preservation, unit payload review, audio support, media rights, route registry, and teacher approval.
- Keep the first implementation static and review-first.

## Deferred Scope

- Automated PDF parser.
- Database-backed intake workflow.
- Uploaded media storage.
- Teacher approval actions.
- Versioned package publishing.
- Student assignment from the intake page.

## Verification

Use `docs/verification/CONTENT_INTAKE_CHECKS.md`.
