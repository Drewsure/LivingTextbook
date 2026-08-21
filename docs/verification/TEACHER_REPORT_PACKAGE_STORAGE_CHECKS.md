# Teacher Report Package Storage Checks

Run after persistence, schema, migration, report export, teacher session, or local deployment changes.

```powershell
npm run verify:foundation
```

Then verify:

- Durable record planning includes `teacher-report-package`.
- Hosted adapter plans include a teacher report package write intent.
- Local classroom adapter plans include a teacher report package write intent.
- Backend schema draft includes `teacher_report_package`.
- Backend migration candidates include a teacher report package boundary migration.
- Backend migration specs define primary key, tenant scope, fields, indexes, retention, export, local fallback, and policy blockers.
- Report package write intents preserve event acceptance summaries.
- Report package write intents and durable records preserve settings context summaries.
- Backend schema and migration specs include `event_acceptance_summary` and `settings_context_summary`.
- Active route verification keeps `settings_context_summary` visible on `/teacher/intake`.
- Report package storage rejects raw learner audio and transcripts.
- Support-only event semantics remain preserved for hosted and local exports.
