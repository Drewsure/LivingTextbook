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
- Report package storage rejects raw learner audio and transcripts.
- Support-only event semantics remain preserved for hosted and local exports.
