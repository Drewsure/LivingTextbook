# First Saleable White-Label Pilot Acceptance Matrix

## Purpose

This matrix is the completion record for the active pilot goal:

> A publisher can provide textbook content, receive a reviewed
> multimedia/game package, print QR codes, and run a teacher-led,
> student-driven learning experience locally or through opt-in hosted
> persistence.

The matrix is intentionally honest about the current state. A route, preview,
or green foundation check is not enough to call the pilot saleable. The pilot
is saleable only when every outcome below has authoritative evidence and the
required human decisions are recorded.

## Acceptance Matrix

| Outcome | Current evidence | Current status | Closure evidence |
| --- | --- | --- | --- |
| Publisher can submit textbook source content | Tenant-scoped controlled quarantine intake workspace at `/teacher/uploads/{tenantId}` plus tenant-scoped source review at `/teacher/sources/{tenantId}`; known and safe review tenants resolve through the shared white-label resolver; source, image, audio, and video channels; checksum and tenant custody boundary; end-to-end synthetic publisher-intake rehearsal passes | Review-only | A real publisher submission is accepted into quarantine with source owner, unit mapping, scan, rights, and retention evidence |
| Publisher can see what is waiting for review | Tenant-scoped metadata and admission APIs plus the live handoff bridge at `/teacher/evidence/{tenantId}/handoff?quarantineId=...`; unprovisioned tenants receive an empty handoff state while a supplied quarantine identity opens the tenant-bound bridge; the bridge now derives a live delivery-manifest preview with future manifest/receipt/index identities | Review-only | Authorized reviewer session loads the real quarantine handoff and confirms tenant, source, package, unit, checksum, evidence, delivery-mode, release, and QR identities |
| Reviewed multimedia/game package exists | Publisher package preview, tenant-scoped upload/source/evidence/media review shells, durable versioned package review packets, checksum-bound assembly preflight, live package evidence lanes, explicit promotion-adapter sidecar, and local writer review-packet binding; curated game routes, media lanes, QR map, local fallback, and hosted-persistence option; delivery manifests and release receipts now fail closed on missing hosted packet identity or unsafe readiness flags; isolated behavior rehearsal proves canonical reviewed content, approved audio/transcript reads, undeclared-media rejection, and one identity-bound local route map for front door, Memory Match, teacher evidence, and media handoff | Blocked | Content, game, audio, media-rights, accessibility, package, adapter, and release evidence are complete for the pilot units; assembly preflight has no blockers and the human release packet is approved |
| QR codes can be printed for the pilot | Deterministic `/q/` aliases, internal browser print-sheet rehearsal, and exact tenant/package/version/unit-scoped fallback resolution; generic local fallbacks are blocked | Production print blocked | Durable QR alias registry, release approval, rollback evidence, local fallback test, and explicit print authorization |
| Teacher-led onboarding works | Teacher QR/front-door, private assignment, session settings, audio-first controls, and teacher report contracts | Rehearsal-only | School/publisher policy acceptance, assignment rollout approval, and teacher-observed browser rehearsal |
| Student self-progression works | Flashcards, matching, memory, syntax, speaking, progression events, earned collection, and target-language-only progression contracts | Demo-ready | Approved package routes run with real pilot content and accepted progress/report persistence |
| Closed local delivery works | Local companion manifest, package-owned tenant branding across the dynamic package runtime and child routes, route fallback, media inventory, PWA/offline readiness, backup/recovery rehearsal, and a package-scoped installer/update/recovery continuity packet; executable isolated assembly/runtime rehearsal proves QR print artifacts, fallback mapping, identity-bound front-door to Memory Match route mapping, content/audio/transcript reads, idempotence, custody, and learner-data exclusion | Planning/review-only | Final checksums, rights, offline package, installer/update artifacts, migration/rollback evidence, local data policy, and device test evidence |
| Opt-in hosted persistence works | Provider-neutral adapter, SQLite implementation, deployment gate, retention/privacy flags, and report recovery rehearsal | Disabled by default | School policy, retention, cost, provider, tenant isolation, backup/restore, and durable-write approval are recorded |
| White-label packaging is preserved | Tenant-scoped branding, content, language, audio, media, game offer, QR, deployment, policy, pilot command shell, and empty pilot-requirements review contracts; unprovisioned tenants do not inherit Sample Publisher evidence | Foundation-ready | A second publisher package passes the same matrix without MiniStar-only assumptions |
| Outside game source can be integrated safely | Frozen Phaser/Z.ai source remains isolated; candidate profiles and evidence return-package verifier exist | Import blocked | Complete `evidence/return-package.json`, adjudication, wrapper mapping, contract replay, and explicit integration decision |

## Current Decision

The first saleable pilot is **not yet approved for sale or live student data**.
The platform has a strong review and rehearsal foundation, including fail-closed
delivery manifest and release-receipt integrity checks, but the package, QR
print, local delivery, and hosted persistence outcomes still require their
closure evidence. The next operational milestone is a real publisher source
submission followed by a complete, human-reviewed Unit 1 package and a chosen
delivery mode.

## Required Human Decisions

1. Provide one real publisher Unit 1 source package and its rights owner.
2. Provide or approve the audio, video, image, poster, transcript, caption,
   font, and background-media evidence for that unit.
3. Choose the first delivery path: hosted PWA, closed local companion, or
   hybrid front door.
4. Approve teacher onboarding, student identity, reporting, retention, and
   backup policy for the pilot.
5. Record the review-only package adapter and confirm it matches the chosen
   delivery mode.
6. After the evidence packet is complete, authorize QR print and package
   release through the release-control gate.

## Verification Procedure

Run the upload intake, quarantine admission, package handoff, publisher package
preview, QR, local bundle, persistence, active-route, browser rehearsal, and
foundation composition checks. Then perform a human browser rehearsal covering
teacher QR entry, target-language audio, flashcards, the next unlocked game,
progress summary, teacher view, local fallback, and the selected persistence
mode.

This document is an acceptance matrix, not a release approval. It must be
updated whenever a requirement changes or a closure record is accepted.
