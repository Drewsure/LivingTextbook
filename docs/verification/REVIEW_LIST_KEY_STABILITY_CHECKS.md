# Review List Key Stability Checks

Use this check after changing teacher/admin review panels that render repeated blocker, warning, evidence, upload, media, or persistence checklist rows.

Command:

```powershell
npm run verify:review-keys
```

The verifier confirms active review surfaces do not use visible text alone as React keys for mapped rows such as `key={item}`, `key={warning}`, `key={record}`, `key={action}`, `key={rule}`, `key={error}`, or `key={step}`.

Required behavior:

- Prefer real record ids where available.
- For plain string arrays, use a stable owner/context plus index and item text.
- Do not use random, timestamp, locale, or browser-generated keys.
- Keep upload, evidence, media, persistence, and asset workspaces free of duplicate-key console warnings.

This check protects foundational teacher review pages before live upload, evidence export, storage writes, or release approvals are enabled.
