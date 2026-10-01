# First Saleable White-Label Pilot Execution Runbook

## Purpose

This runbook is the operational path from a publisher's first Unit 1 source
submission to a reviewed multimedia/game package and a controlled teacher-led
pilot. It is separate from the MiniStar reference tenant and does not
authorize live student use by itself.

The platform remains white-label. MiniStar and Sample Publisher are reference
tenants only; a real publisher receives a tenant-scoped package, branding
profile, media policy, route map, and evidence lineage of its own.

## Gate 0: Human Inputs Before Intake

The publisher or school supplies:

1. One Unit 1 source package, preferably PDF plus editable source material,
   with a named rights owner and edition/version.
2. The intended unit identifier, target language, support language policy, and
   textbook page or section for each QR code.
3. Rights evidence for every supplied PDF, font, image, audio/music track,
   video, poster, transcript, caption, and background-media item.
4. A delivery choice: hosted PWA, closed-local companion, or hybrid.
5. Teacher/school policy for onboarding, student identity, retention, backup,
   reporting, and optional hosted persistence.

No source file becomes student-facing merely because it was uploaded.

## Gate 1: Tenant-Scoped Intake

Open `/teacher/uploads/{tenantId}`. Enable the quarantine file picker only
after the custody root, tenant authorization, and intake policy are provisioned.
Use the appropriate channel for PDF/text, labelled-diagram images, audio/music,
or video. Record source owner, unit mapping, checksum, scan result, rights
status, retention, and upload timestamp.

Review the quarantined source at `/teacher/sources/{tenantId}`. Extraction,
OCR, mapping, accessibility, and rights review remain active gates.

For a completed publisher folder, run the canonical preflight first. Then
create the endpoint-shaped evidence request with:

```powershell
node scripts/create-publisher-source-preflight-evidence-request.mjs `
  --root "<completed-publisher-source-folder>" `
  --output "<review-folder>\source-preflight-evidence-request.json" `
  --tenant "<tenant-id>" `
  --quarantine "<q-uuid>"
```

The command is create-once and metadata-only. It is safe to hand to the
authorized evidence route, but it does not upload source files or approve the
source. The quarantine record and source checksum must still match before the
server records the evidence.

If the review service is available and the deployment operator has the
tenant-allowlisted quarantine credential, submit the request without copying
publisher files into the command:

```powershell
$env:LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_API_TOKEN = "<server-side-token>"
node scripts/submit-publisher-source-preflight-evidence-request.mjs `
  --request "<review-folder>\source-preflight-evidence-request.json" `
  --base-url "http://127.0.0.1:3000"
```

Never place the token in the JSON request, browser fields, QR data, or learner
routes. A `recorded-review-only` response is evidence capture only; continue
through the remaining package and release gates.

## Gate 2: Reviewed Unit Package

The reviewer must resolve canonical content, target-language audio for every
student-facing text lane, support-only language material, image labels,
approved fonts, all media and transcript mappings, curated games,
deterministic scoring, audio-priority background media, privacy, and package
identity. Every checked lane must point to a bounded evidence record.

## Gate 3: Delivery Selection

- **Hosted PWA:** provider, cost, retention, tenant isolation, backup/restore,
  and durable-write approval are required.
- **Closed-local:** offline bundle, local data policy, device tests,
  installer/update/recovery evidence, and local fallback tests are required.
- **Hybrid:** both evidence sets and an explicit hosted-redirect policy are
  required.

Hosted persistence is opt-in and disabled by default. No QR or classroom
launch action may infer consent from a delivery-mode preview.

## Gate 4: Package and QR Review

Release control reconciles the delivery manifest, release receipt, package
index, review packet, QR registry, QR print artifact, local bundle, and
integrity ledger. A closed-local or hybrid package must contain package-owned
branding, curated routes, approved content/media, QR aliases and fallbacks,
print-sheet checksum, file checksums/byte counts, handoff receipt, and
installer/update/recovery continuity evidence.

The controlled write order is strict: first capture the approved delivery
metadata and release receipt, then register the QR aliases against that durable
release record, then assemble the closed-local package. The QR registry API
requires the same quarantine review lineage and accepts only a manifest and
receipt that match the stored release metadata. Local assembly then requires
both durable records before it can run.

Verified read lanes are:

- `/api/local-package/handoff`
- `/api/local-package/integrity`
- `/api/local-package/qr-print`

Before invoking the writer, the operator may submit the same bounded assembly
request to `/api/teacher/delivery/local-package/preflight`. A
`ready-for-assembly` response is a read-only readiness result, not release
authorization. It performs no local write and does not print QR codes or
activate students. The mutation route repeats the same preflight immediately
before assembly.

For the operator workflow, the preflight and writer also accept a bounded
durable-records draft containing the tenant/package/version identity, review
packet and quarantine ids, reviewed bundle manifest, operator id, and
timestamp. The server derives the approved delivery records from exact
tenant/package/version custody; it does not trust copied client records or
perform wildcard lookups.

These are evidence/read lanes, not production print authorization or package
export controls.

Before the durable-records package request is used, the operator may persist a
reviewed bundle-manifest record through
`/api/teacher/delivery/local-package/bundle-manifest-review`. The record is
bound to the exact tenant/package/version, quarantine, review packet, source
preflight evidence, reviewer, and canonical manifest checksum. A later
durable-records request may provide `bundleManifestReviewId` plus `version`
instead of copying the manifest into the request. This improves custody
integrity but does not grant assembly or release permission; the record keeps
all activation and learner-data flags false and the write gate is disabled by
default.

## Gate 5: Human Browser Rehearsal

With the real pilot package, a teacher or reviewer must:

1. Open the teacher-provided QR/front door.
2. Confirm tap-to-speak target-language audio on all student-facing text.
3. Complete flashcard entry practice.
4. Confirm target-language activity, never support-language taps, unlocks the
   next game.
5. Play the curated game and confirm deterministic scoring and completion.
6. Confirm progress and teacher evidence share tenant, unit, package, and
   session identities.
7. Confirm audio, video, poster, transcript, and optional background media
   follow the approved policy.
8. Test the printed QR fallback on the selected device path.
9. Confirm no raw learner audio, learner records, or unsupported files appear.

Use synthetic learner identities until school launch policy, retention,
reporting, persistence, and release gates are accepted.

## Gate 6: Release Authorization

Production printing and live launch require explicit human authorization after
closure evidence is attached. Record reviewer identity, final package/source/
release/QR/integrity identities, rollback evidence, print authorization,
deployment target, persistence policy, and school/publisher approval.

No code path, API read, or handoff receipt substitutes for this approval.

## Z.ai / Frozen Phaser Boundary

Frozen Z.ai/Phaser source remains isolated until a complete
`evidence/return-package.json` is supplied with source, replay, audio, scoring,
accessibility, wrapper, and provenance evidence. Codex then maps the candidate
to shared contracts before any source is promoted.

## Verification Commands

From PowerShell:

```powershell
Set-Location -LiteralPath "D:\LIVING TEXTBOOOK PROJECT\LivingTextbook"
npm run verify:foundation
```

Do not use `cd /d` in PowerShell or paste Markdown fence lines into the
terminal. A successful foundation run is not human release approval.

## Current Status

The foundation, canonical game pathways, local package assembly, verified QR
print read, package handoff receipt, checksum ledger, and integrity read lane
are implemented and verified. The pilot still awaits the real publisher
source, rights/accessibility/media evidence, delivery choice, policy decisions,
device rehearsal, and production release authorization.

