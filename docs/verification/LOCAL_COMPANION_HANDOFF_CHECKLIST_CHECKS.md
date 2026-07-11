# Local Companion Handoff Checklist Checks

Run after local companion, local bundle, media rights, checksum, or local report-policy changes.

```powershell
npm run verify:foundation
```

Then verify:

- `http://127.0.0.1:3000/local/sample-publisher` loads.
- The page shows `Package handoff checklist`.
- The checklist includes publisher-owned source/media requirements.
- The checklist includes platform-owned package/checksum requirements.
- The checklist includes school-owned local report policy.
- Blocked items prevent offline-ready claims.
