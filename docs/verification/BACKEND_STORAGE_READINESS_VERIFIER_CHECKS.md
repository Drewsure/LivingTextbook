# Backend Storage Readiness Verifier Checks

## Scope

Run before backend selection, vendor-specific migrations, persistence adapter changes, class roster plan work, source extraction review packet work, upload file policy profile work, upload intake work, evidence packet work, evidence attachment storage work, activity compatibility snapshot work, template rendering profile work, font accessibility profile work, game mode settings storage work, launch-session storage work, teacher draft storage work, teacher draft review handoff work, teacher draft verifier submission work, AI prototype scoring replay storage work, AI generated package manifest work, AI generated package assembly dry-run storage work, AI generated package writer preflight storage work, AI generated package writer rollback drill storage work, AI generated package writer implementation readiness storage work, AI generated package writer module test plan storage work, AI generated package writer test evidence packet storage work, AI generated package writer test harness plan storage work, AI generated package writer test harness implementation proposal storage work, teacher draft reviewer decision work, teacher draft review evidence work, teacher draft review audit trail work, tenant library storage work, earned collection storage work, report package storage work, local companion storage work, classroom launch gate work, school launch policy gate work, or route registry persistence work.

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
- AI generated package assembly dry runs preserve assembly readiness links, generated manifest links, artifact maps, source record ids, and blocked dry-run actions while blocking package JSON writes, route registry writes, media playlist writes, local bundle writes, assignments, student-ready markers, and support-language-only assembly.
- AI generated package writer preflights preserve assembly dry-run links, writer targets, required evidence, and blocked writer actions while blocking writer execution, package JSON writes, route registry writes, media playlist writes, local bundle writes, assignments, student-ready markers, and support-language-only writers.
- AI generated package writer rollback drills preserve writer preflight links, pre-write snapshots, post-write verification, rollback steps, and blocked rollback actions while blocking rollback execution, writer execution, package JSON rollback, route rollback, playlist rollback, local bundle rollback, assignment mutation, production QR redirect mutation, student-ready markers, and support-language-only rollback evidence.
- AI generated package writer implementation readiness records preserve rollback drill links, module plans, required test gates, release controls, next records, and blocked implementation actions while blocking package writer implementation, writer execution, generated app file writes, route mutation, playlist creation, local bundle packaging, assignment activation, student-ready markers, production QR redirect mutation, and support-language-only implementation evidence.
- AI generated package writer module test plan records preserve implementation readiness links, rollback drill links, module test suites, required fixtures, required assertions, required evidence, blocked test actions, and support-language boundaries while blocking automated writer test execution, writer mutation browser runs, app file patches, generated package JSON writes, route registry writes, playlist writes, local bundle packaging, assignment activation, production QR redirect mutation, and support-language-only test passes.
- AI generated package writer test evidence packet records preserve module test plan links, implementation readiness links, rollback drill links, evidence lanes, source records, required evidence, acceptance checks, missing evidence, blocked evidence actions, and support-language boundaries while blocking automated writer test execution, writer mutation browser runs, evidence upload, signed approval capture, app file patches, generated package JSON writes, route registry writes, playlist writes, local bundle packaging, assignment activation, production QR redirect mutation, and support-language-only evidence passes.
- AI generated package writer test harness plan records preserve test evidence packet links, module test plan links, implementation readiness links, rollback drill links, harness phases, environment adapters, required-before-harness prerequisites, blocked harness actions, and support-language boundaries while blocking test harness implementation, automated writer test execution, writer mutation browser runs, evidence upload, signed approval capture, app file patches, generated package JSON writes, route registry writes, playlist writes, local bundle packaging, assignment activation, production QR redirect mutation, and support-language-only harness passes.
- AI generated package writer test harness implementation proposal records preserve test harness plan links, test evidence packet links, module test plan links, proposed module scope, implementation boundaries, required review gates, dry-run-only checks, next records, blocked actions, and support-language boundaries while blocking test harness implementation, automated writer test execution, writer mutation browser runs, evidence upload, signed approval capture, app file patches, generated package JSON writes, route registry writes, playlist writes, local bundle packaging, assignment activation, production QR redirect mutation, and support-language-only harness passes.
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
- Game mode settings storage records preserve settings profile, teacher snapshot, and change-request entities before live timer, difficulty, motion, attempts, background media, skin, arcade speed, or safe-default changes can persist.
- Game mode settings records preserve learning-audio priority, target-language-only progress, support-language support-only boundaries, accessibility review, school policy acceptance, release control, deterministic scoring ownership, and safe-default mutation blocks.
- Teacher draft reviewer decisions preserve evidence requirements and block package state changes.
- Teacher draft review evidence packets preserve evidence requirements and block uploads.
- Teacher draft review audit trails preserve event sequence and block audit-driven package state changes.
- Tenant library items preserve source lineage, block student-data copies, and block public community publishing.
- Teacher dry-run rehearsal records preserve route, game/audio, media/support-language, report, and local fallback checks while blocking student launch, real learner data collection, live progress, and report export.
- Core storage rejects raw learner audio and transcripts.
- Progress events preserve event effect taxonomy, event acceptance gates, and settings context.
- Launch sessions preserve teacher session settings, settings review packets, and assist-language teacher enablement.
- Launch-session validators and UI readiness markers expose `Settings review packet` before live setting saves are possible.
- Hosted and local adapter plans both include launch-session writes.
- Hosted and local adapter plans both include earned collection inventory writes.
- Hosted and local adapter plans both include teacher draft package writes.
- Hosted and local adapter plans both include teacher draft review handoff packet writes.
- Hosted and local adapter plans both include teacher draft verifier submission preflight writes.
- Hosted and local adapter plans both include AI prototype scoring replay report writes.
- Hosted and local adapter plans both include AI generated package manifest writes.
- Hosted and local adapter plans both include AI generated package assembly dry-run writes.
- Hosted and local adapter plans both include AI generated package writer preflight writes.
- Hosted and local adapter plans both include AI generated package writer rollback drill writes.
- Hosted and local adapter plans both include AI generated package writer implementation readiness writes.
- Hosted and local adapter plans both include AI generated package writer module test plan writes.
- Hosted and local adapter plans both include AI generated package writer test evidence packet writes.
- Hosted and local adapter plans both include AI generated package writer test harness plan writes.
- Hosted and local adapter plans both include AI generated package writer test harness implementation proposal writes.
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
- Hosted and local adapter plans both include game mode settings profile, teacher game mode settings snapshot, and game mode settings change-request writes.
- Hosted and local adapter plans both include teacher draft reviewer decision writes.
- Hosted and local adapter plans both include teacher draft review evidence packet writes.
- Hosted and local adapter plans both include teacher draft review audit trail writes.
- Hosted and local adapter plans both include tenant library item writes.
- Hosted and local adapter plans both include teacher dry-run rehearsal writes.
- Durable record plans assign teacher settings and settings review packets to launch sessions, require event acceptance gates, preserve earned collection rules, preserve teacher draft review gates, preserve draft review handoff packet sections, preserve verifier preflight checks, preserve AI prototype scoring replay reports, preserve AI generated package manifest lineage, preserve AI generated package assembly dry-run artifact maps, preserve AI generated package writer preflight maps, preserve AI generated package writer rollback drill evidence, preserve AI generated package writer implementation readiness gates, preserve AI generated package writer module test plan records, preserve AI generated package writer test evidence packet records, preserve AI generated package writer test harness plan records, preserve AI generated package writer test harness implementation proposal records, preserve source extraction review packets, preserve upload file policy profiles, preserve upload source lineage, preserve upload target mapping packets, preserve evidence packet flows, preserve evidence attachment metadata, preserve reviewer identity/signature gates, preserve school launch policy gates, preserve class roster plan boundaries, preserve activity compatibility snapshots, preserve template rendering profiles, preserve font accessibility profiles, preserve game mode settings records, preserve reviewer decision evidence requirements, preserve review evidence packets, preserve review audit trails, and preserve tenant library source-lineage rules.

## Human Follow-Up

Open `http://127.0.0.1:3000/teacher/intake` and confirm the backend decision, schema, migration candidate, migration spec, persistence, and foundation verification panels all remain visible and vendor-neutral.
