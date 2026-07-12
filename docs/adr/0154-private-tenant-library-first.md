# ADR 0154: Private Tenant Library First

## Status

Accepted

## Context

Competitor products often rely on public community resource libraries. Those are powerful, but they carry moderation, copyright, privacy, quality, and tenant-isolation burden. Living Textbook needs a safer white-label path first.

## Decision

Add a private tenant library plan, teacher/admin panel, and verifier.

## Consequences

- `/teacher/intake` shows teacher private drafts, tenant-approved library, school sharing, and public community blocked for v1.
- `npm run verify:tenant-library` is included in `npm run verify:foundation`.
- Public community resources remain a future opportunity, not a v1 promise.
- The platform has a clear workaround path for teachers who need reusable resources before public sharing exists.
