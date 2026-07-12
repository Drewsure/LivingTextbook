# DR-161: Teacher Session Settings Contract Verifier

## Decision

Add a focused verifier for teacher session settings and include it in the foundation verification command.

## Rationale

The platform is gaining more teacher-controlled session rules. A verifier helps prevent regressions in safety rules before visual testing, especially around support language, raw audio, transcripts, background media, AI Tutor, and reporting.

## Accepted Direction

- Add `scripts/verify-teacher-session-settings.mjs`.
- Add `npm run verify:session-settings`.
- Include it in `npm run verify:foundation`.
- Document human follow-up checks for the teacher session pages.

## Follow-Up

Expand the verifier when teacher session settings move from sample data into real hosted or local persistence adapters.
