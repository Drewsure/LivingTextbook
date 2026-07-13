# Backend Storage Readiness Verifier Checks

## Scope

Run before backend selection, vendor-specific migrations, persistence adapter changes, upload intake work, launch-session storage work, teacher draft storage work, teacher draft review handoff work, teacher draft verifier submission work, teacher draft reviewer decision work, teacher draft review evidence work, teacher draft review audit trail work, tenant library storage work, earned collection storage work, report package storage work, local companion storage work, or route registry persistence work.

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
- Earned collection inventory preserves mastery-earned ownership and blocks random reward pressure.
- Teacher draft packages preserve owner, source lineage, review gates, audio plan state, and direct-assignment blocks.
- Teacher draft review handoff packets preserve schema, lineage, audio, rights/version, route/activity, and approval packet sections while blocking live review submission.
- Teacher draft verifier submission preflights preserve schema, audio, language, route, and evidence checks while blocking automatic verifier submission.
- Upload intake records preserve source lineage, file metadata, target mapping, rights/scan/review state, and block student-facing upload use.
- Teacher draft reviewer decisions preserve evidence requirements and block package state changes.
- Teacher draft review evidence packets preserve evidence requirements and block uploads.
- Teacher draft review audit trails preserve event sequence and block audit-driven package state changes.
- Tenant library items preserve source lineage, block student-data copies, and block public community publishing.
- Core storage rejects raw learner audio and transcripts.
- Progress events preserve event effect taxonomy and event acceptance gates.
- Launch sessions preserve teacher session settings and assist-language teacher enablement.
- Hosted and local adapter plans both include launch-session writes.
- Hosted and local adapter plans both include earned collection inventory writes.
- Hosted and local adapter plans both include teacher draft package writes.
- Hosted and local adapter plans both include teacher draft review handoff packet writes.
- Hosted and local adapter plans both include teacher draft verifier submission preflight writes.
- Hosted and local adapter plans both include upload intake writes.
- Hosted and local adapter plans both include teacher draft reviewer decision writes.
- Hosted and local adapter plans both include teacher draft review evidence packet writes.
- Hosted and local adapter plans both include teacher draft review audit trail writes.
- Hosted and local adapter plans both include tenant library item writes.
- Durable record plans assign teacher settings to launch sessions, require event acceptance gates, preserve earned collection rules, preserve teacher draft review gates, preserve draft review handoff packet sections, preserve verifier preflight checks, preserve upload source lineage, preserve reviewer decision evidence requirements, preserve review evidence packets, preserve review audit trails, and preserve tenant library source-lineage rules.

## Human Follow-Up

Open `http://127.0.0.1:3000/teacher/intake` and confirm the backend decision, schema, migration candidate, migration spec, persistence, and foundation verification panels all remain visible and vendor-neutral.
