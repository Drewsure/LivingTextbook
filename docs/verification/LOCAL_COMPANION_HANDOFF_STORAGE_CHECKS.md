# Local Companion Handoff Storage Checks

Run after local companion, persistence, schema, migration, local bundle, checksum, or installer/update changes.

```powershell
npm run verify:foundation
```

Then verify:

- Durable records include `local-companion-handoff`.
- Hosted adapter plans include a local companion handoff write intent.
- Local adapter plans include a local companion handoff write intent.
- Backend schema draft includes `local_companion_handoff`.
- Backend migration candidates include local companion handoff records.
- Backend migration specs define primary key, tenant scope, handoff items, blocker count, offline-ready gate, retention, export, and local fallback.
- Offline-ready status is derived from checklist completion and cannot be manually overridden.
