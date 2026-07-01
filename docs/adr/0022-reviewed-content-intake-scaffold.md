# ADR 0022: Reviewed Content Intake Scaffold

Status: Accepted

Date: 2026-07-01

## Context

White-label textbook partners will provide PDF, DOCX, spreadsheet, audio, video, and media-folder sources. The platform must support this without trusting raw extraction or letting AI drafts become student-facing content automatically.

## Decision

Add a teacher/admin content intake scaffold that models the review gates required before a source package can become a student-assignable Living Textbook package.

The scaffold includes:

- source metadata capture,
- reviewed unit payload checks,
- audio support plan checks,
- media rights/file handoff checks,
- front-door route registry checks,
- teacher approval as a future required gate.

## Consequences

The app now has a visible `/teacher/intake` route showing both MiniStar and sample publisher intake examples. It is not an automated importer. It is a review-first foundation screen that prevents the build from drifting toward unsafe or unreviewed content publishing.

## Guardrails

- Do not assign PDF/DOCX extracted content directly to students.
- Do not mark a package approved until media rights and audio support are clear.
- Do not confuse placeholder media metadata with real licensed files.
- Keep the intake scaffold tenant-aware and white-label safe.
- Replace static intake runs with a database-backed review workflow before a real pilot.
