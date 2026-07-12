# DR-164: Assist Language Enable Persistence Field

## Decision

Expose assist-language teacher enablement persistence as a backend schema and migration field.

## Rationale

Support-language visibility is a teacher launch-session rule. If the backend only stores generic settings JSON, implementations may miss the need to audit whether that teacher choice actually persisted across devices.

## Accepted Direction

- Add `assist_language_teacher_enablement_persisted` to backend schema and migration previews.
- Mention assist-language teacher enablement in hosted and local persistence adapter plans.
- Extend `npm run verify:session-settings` to check these storage previews.

## Follow-Up

When a real backend is chosen, implement this field or an equivalent indexed/auditable setting while keeping the full settings snapshot exportable.
