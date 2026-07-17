# Share And Embed Readiness Contract

Document type: foundation contract

Related:

- `docs/COMPETITIVE_FEATURE_COVERAGE_MATRIX.md`
- `docs/PRIVATE_TENANT_LIBRARY_CONTRACT.md`
- `docs/TEACHER_AUTHORING_READINESS_CONTRACT.md`
- `docs/ACTIVE_ROUTE_VERIFICATION_LIST.md`
- `docs/verification/SHARE_EMBED_READINESS_CHECKS.md`

## Purpose

This contract defines how Living Textbook should approach share links, assignment links, colleague sharing, public links, and website embeds.

The goal is to preserve the teacher time-saving value of competitor-style sharing without exposing private tenant content, student reports, unreviewed drafts, or rights-restricted media.

## Core Rule

Private assignment links come first.

Public sharing, public community discovery, and iframe embeds are not v1 features. They remain blocked until access control, reporting boundaries, rights, origin policy, moderation, and tenant approval are durable.

## First Share Path

The first share path should be:

1. A reviewed package or reviewed activity pathway.
2. A private assignment or QR/front-door route.
3. Student-facing activity view without teacher/admin controls.
4. Event acceptance and teacher-visible report boundaries.
5. Tenant-scoped access and retention policy once persistence exists.

This matches the existing QR/classroom direction and avoids a distracting public activity page for young learners.

## Planned Sharing Lanes

- Private assignment links: planned first production share path.
- Teacher colleague sharing: planned through private tenant libraries and copy-as-draft flow.
- Public share links: blocked for v1.
- Website iframe embeds: optional later.
- Public community discovery: blocked for v1.

## Required Gates

Before public links or iframe embeds:

- Tenant access control must exist.
- Teacher, student, publisher, and tenant-admin roles must be defined.
- Assignment reporting boundaries must preserve privacy.
- Embed origin policy must define allowlists, sandboxing, token expiry, and fallback behavior.
- Rights and visibility must be checked for package, media, printable, and tenant approvals.
- Public community discovery must have moderation, copyright, abuse, quality, and tenant-isolation policy.

## Current Implementation

The visible planning gate is shown on `/teacher/intake`.

The sample data lives in `apps/web/src/data/sampleShareEmbedReadinessPlan.ts`.

The focused verifier is `npm run verify:share-embed`, and it is included in `npm run verify:foundation`.

## Storage Contract

The backend-neutral private assignment record is `private_assignment_link` / `private-assignment-link`.

Hosted and local implementations must preserve tenant scope, assignment binding, package binding, launch-session binding, assignment path, student target path, access mode, visibility, safety boundaries, expiry policy, report boundary, and target-language trigger policy.

The record must block public sharing, iframe embed use, public community discovery, teacher/admin control exposure, real learner data collection, and report export until the relevant access, rights, moderation, reporting, retention, and school policies pass.

## Acceptance Standard

No future agent should build public share links, public community search, or website embeds before this contract's blockers are resolved.

Private assignment links and QR routes can continue to advance as the first student-safe sharing model.
