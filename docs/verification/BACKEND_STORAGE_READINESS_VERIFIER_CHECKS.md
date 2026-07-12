# Backend Storage Readiness Verifier Checks

## Scope

Run before backend selection, vendor-specific migrations, persistence adapter changes, launch-session storage work, report package storage work, local companion storage work, or route registry persistence work.

## Automated Command

```powershell
npm run verify:backend-storage
```

This command is also included in:

```powershell
npm run verify:foundation
```

## What It Protects

- Vendor-neutral backend schema entities remain present.
- Migration candidates stay sequenced before backend-specific implementation.
- Migration specs preserve tenant, package, launch-session, event, report, and local companion records.
- Core storage rejects raw learner audio and transcripts.
- Progress events preserve event effect taxonomy and event acceptance gates.
- Launch sessions preserve teacher session settings and assist-language teacher enablement.
- Hosted and local adapter plans both include launch-session writes.
- Durable record plans assign teacher settings to launch sessions and require event acceptance gates.

## Human Follow-Up

Open `http://127.0.0.1:3000/teacher/intake` and confirm the backend decision, schema, migration candidate, migration spec, persistence, and foundation verification panels all remain visible and vendor-neutral.
