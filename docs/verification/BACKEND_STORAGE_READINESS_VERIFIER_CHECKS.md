# Backend Storage Readiness Verifier Checks

## Scope

Run before backend selection, vendor-specific migrations, persistence adapter changes, class roster plan work, source extraction review packet work, upload file policy profile work, upload intake work, evidence packet work, evidence attachment storage work, activity compatibility snapshot work, template rendering profile work, font accessibility profile work, launch-session storage work, teacher draft storage work, teacher draft review handoff work, teacher draft verifier submission work, AI prototype scoring replay storage work, AI generated package manifest work, teacher draft reviewer decision work, teacher draft review evidence work, teacher draft review audit trail work, tenant library storage work, earned collection storage work, report package storage work, local companion storage work, classroom launch gate work, school launch policy gate work, or route registry persistence work.

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
- AI prototype scoring replay reports preserve game scoring profile snapshot, progress event acceptance map, collection unlock binding, standard event contract, deterministic scoring replay, mastery replay, and reward boundary evidence while blocking score authority, scoring profile overrides, Star Dust writes, reward inventory writes, random rewards, media-only mastery, support-language mastery, package promotion, and assignments.
- AI generated package manifests preserve prompt, draft JSON, audio, engine, gamification, verifier, review queue, media-rights, and release-lock lineage while blocking package assembly, route registry writes, media playlist writes, assignments, local bundle writes, and student-ready markers.
- Upload intake records preserve source lineage, file metadata, target mapping, rights/scan/review state, and block student-facing upload use.
- Upload review and promotion records preserve `target_mapping_packet` so uploads cannot become drafts, assets, playlists, local bundles, routes, or assignments through a vague target field.
- Evidence packet records preserve packet keys, required evidence, missing evidence, blocked live actions, and handoff rules while blocking evidence upload, signed approval capture, promotion, and student-facing use.
- Evidence attachment records preserve storage candidate, quarantine path, checksum requirement, malware scan status, retention period, delete/export policy, access-control status, and hosted/local/hybrid storage blocks while blocking upload, object writes, local folder writes, downloads, signed approval attachments, release-state mutation, and student-facing attachments.
- Reviewer identity and signature gate records preserve reviewer identity, approval intent, signature policy, audit retention, revocation, and release-control binding while blocking approval capture, signature attachment upload, signed PDF packets, release-state mutation, evidence downloads, and approval-driven assignment.
- School launch policy gate records preserve school, publisher, platform, and shared dry-run ownership while blocking policy acceptance workflows, live launch, real learner data, report export, local activation, launch-ready status, and support-language-only progression.
- Class roster plan records preserve coded learner slots, launch/package binding, roster readiness, identity mode, and data boundaries while blocking real learner names, family contact, raw audio, transcripts, production accounts, and report export.
- Source extraction review packet records preserve source lineage, extraction method, OCR confidence, segmentation review, candidate payloads, review status, and blockers while blocking raw PDF student payloads, unreviewed OCR assignments, unreviewed extraction promotion, and direct student assignment.
- Upload file policy profile records preserve accepted extensions, MIME rules, maximums, required checks, scan/file policy packets, and blocked shortcuts while blocking uploads without accepted policy, unsafe MIME types, oversize uploads, unchecked file scans, and student-facing uploaded file use.
- Activity compatibility snapshots preserve payload shape, allowed activity modes, blocked conversions, target-language trigger policy, printable output policy, and student-facing pathway blocks.
- Template rendering profiles preserve Flip Tiles-style source template identity, compatible game families, row/media slot policy, layout constraints, and student-facing rendering blocks.
- Font accessibility profiles preserve approved learner fonts, tenant font packs, multilingual rendering rules, readability checks, license review, and student-facing font blocks.
- Teacher draft reviewer decisions preserve evidence requirements and block package state changes.
- Teacher draft review evidence packets preserve evidence requirements and block uploads.
- Teacher draft review audit trails preserve event sequence and block audit-driven package state changes.
- Tenant library items preserve source lineage, block student-data copies, and block public community publishing.
- Teacher dry-run rehearsal records preserve route, game/audio, media/support-language, report, and local fallback checks while blocking student launch, real learner data collection, live progress, and report export.
- Core storage rejects raw learner audio and transcripts.
- Progress events preserve event effect taxonomy and event acceptance gates.
- Launch sessions preserve teacher session settings and assist-language teacher enablement.
- Hosted and local adapter plans both include launch-session writes.
- Hosted and local adapter plans both include earned collection inventory writes.
- Hosted and local adapter plans both include teacher draft package writes.
- Hosted and local adapter plans both include teacher draft review handoff packet writes.
- Hosted and local adapter plans both include teacher draft verifier submission preflight writes.
- Hosted and local adapter plans both include AI prototype scoring replay report writes.
- Hosted and local adapter plans both include AI generated package manifest writes.
- Hosted and local adapter plans both include upload intake, upload review, and upload promotion writes with target mapping packet preservation.
- Hosted and local adapter plans both include evidence packet writes.
- Hosted and local adapter plans both include evidence attachment metadata writes.
- Hosted and local adapter plans both include reviewer identity and signature gate writes.
- Hosted and local adapter plans both include school launch policy gate writes.
- Hosted and local adapter plans both include class roster plan writes.
- Hosted and local adapter plans both include source extraction review packet writes.
- Hosted and local adapter plans both include upload file policy profile writes.
- Hosted and local adapter plans both include activity compatibility snapshot writes.
- Hosted and local adapter plans both include template rendering profile writes.
- Hosted and local adapter plans both include font accessibility profile writes.
- Hosted and local adapter plans both include teacher draft reviewer decision writes.
- Hosted and local adapter plans both include teacher draft review evidence packet writes.
- Hosted and local adapter plans both include teacher draft review audit trail writes.
- Hosted and local adapter plans both include tenant library item writes.
- Hosted and local adapter plans both include teacher dry-run rehearsal writes.
- Durable record plans assign teacher settings to launch sessions, require event acceptance gates, preserve earned collection rules, preserve teacher draft review gates, preserve draft review handoff packet sections, preserve verifier preflight checks, preserve AI prototype scoring replay reports, preserve AI generated package manifest lineage, preserve source extraction review packets, preserve upload file policy profiles, preserve upload source lineage, preserve upload target mapping packets, preserve evidence packet flows, preserve evidence attachment metadata, preserve reviewer identity/signature gates, preserve school launch policy gates, preserve class roster plan boundaries, preserve activity compatibility snapshots, preserve template rendering profiles, preserve font accessibility profiles, preserve reviewer decision evidence requirements, preserve review evidence packets, preserve review audit trails, and preserve tenant library source-lineage rules.

## Human Follow-Up

Open `http://127.0.0.1:3000/teacher/intake` and confirm the backend decision, schema, migration candidate, migration spec, persistence, and foundation verification panels all remain visible and vendor-neutral.
