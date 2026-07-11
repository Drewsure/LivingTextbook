# Local Companion Release Gate Storage Checks

## Scope

Run after local companion release gate, persistence, schema, migration, installer/update, backup/export, or local bundle changes.

## Checks

- Durable records include `local-companion-release-gate`.
- Hosted adapter plans include a local companion release gate write intent.
- Local adapter plans include a local companion release gate write intent.
- Backend schema draft includes `local_companion_release_gate`.
- Backend migration candidates include local companion release gate records.
- Backend migration specs define primary key, tenant scope, gate items, blocked count, closed handoff flag, retention, export, and local fallback.
- Closed handoff remains blocked while installer/update, media rights/checksums, backup/export, QR fallback, game/audio reporting, or school access/privacy gates are open.

## Verification Command

```powershell
npm run verify:foundation
```
