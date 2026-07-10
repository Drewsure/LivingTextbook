# Publisher Maintenance Change Storage Checks

Run after publisher maintenance, persistence, schema, migration, package release, QR alias, media rights, or local bundle changes.

```powershell
npm run verify:foundation
```

Then verify:

- Durable records include `publisher-maintenance-change`.
- Hosted adapter plans include a publisher maintenance change write intent.
- Local adapter plans include a publisher maintenance change write intent.
- Backend schema draft includes `publisher_maintenance_change`.
- Backend migration candidates include publisher maintenance change request records.
- Backend migration specs define primary key, tenant scope, impact summary, approvals, blockers, retention, export, and local fallback.
- Change requests are review records, not direct mutation of active routes/media/games/reports.
