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
| Publisher can submit textbook source content | Tenant-scoped controlled quarantine intake workspace at `/teacher/uploads/{tenantId}` plus tenant-scoped source review at `/teacher/sources/{tenantId}`; a fresh synthetic publisher tenant is proven to start empty and isolated from Sample Publisher/MiniStar records before intake; unprovisioned tenants receive the real opt-in quarantine file picker only when the server gate and custody root are explicitly provisioned, while the default route remains input-free; source, image, audio, and video channels; checksum and tenant custody boundary; end-to-end synthetic publisher-intake rehearsal passes | Review-only | A real publisher submission is accepted into quarantine with source owner, unit mapping, scan, rights, and retention evidence |
| Publisher can see what is waiting for review | Tenant-scoped source-review workspaces now expose the authorized quarantine metadata bridge; metadata and admission APIs plus the live handoff bridge at `/teacher/evidence/{tenantId}/handoff?quarantineId=...`; unprovisioned tenants receive an empty handoff state while a supplied quarantine identity opens the tenant-bound bridge; the bridge derives live delivery-manifest, release-receipt, package-index, and release-preflight previews, all bound to the submission checksum; the end-to-end intake rehearsal now fetches that exact browser route before and after evidence progression and verifies identity/boundary markers | Review-only | Authorized reviewer session loads the real quarantine handoff and confirms tenant, source, package, unit, checksum, evidence, delivery-mode, release, and QR identities |
| Reviewed multimedia/game package exists | Publisher package preview, tenant-scoped upload/source/evidence/media review shells, durable versioned package review packets, checksum-bound assembly preflight, live package evidence lanes, bounded lane-specific evidence-reference IDs, explicit promotion-adapter sidecar, local writer review-packet binding, and a normalized seven-input local assembly request preview; the fresh-tenant rehearsal proves reviewed multimedia/game evidence can be recognized without silently authorizing delivery; curated game routes, media lanes, QR map, local fallback, and hosted-persistence option; delivery manifests and release receipts fail closed on missing hosted packet identity or unsafe readiness flags; isolated behavior rehearsal proves canonical reviewed content, approved audio/transcript reads, undeclared-media rejection, and one identity-bound local route map for front door, Memory Match, teacher evidence, and media handoff; shared deterministic package identity derivation now keeps review, evidence, delivery, and release lineage aligned | Blocked | Content, game, audio, media-rights, accessibility, package, adapter, and release evidence are complete for the pilot units; every reviewed lane points to an authoritative bounded record; assembly preflight has no blockers and the human release packet is approved |
| QR codes can be printed for the pilot | Deterministic `/q/` aliases, internal browser print-sheet rehearsal, exact tenant/package/version/unit-scoped fallback resolution, a review-only QR alias registry preview, a guarded durable registry writer with idempotent replay and conflict detection, a release preflight that reconciles manifest/receipt/registry identity and checksum, and a side-effect-free QR print authorization preflight; generic local fallbacks are blocked | Production print blocked | Human release approval, rollback evidence, local fallback test, explicit print authorization, and controlled registry deployment |
| Teacher-led onboarding works | Teacher QR/front-door, private assignment, session settings, audio-first controls, and teacher report contracts | Rehearsal-only | School/publisher policy acceptance, assignment rollout approval, and teacher-observed browser rehearsal |
| Student self-progression works | Flashcards, matching, memory, syntax, speaking, progression events, earned collection, and target-language-only progression contracts | Demo-ready | Approved package routes run with real pilot content and accepted progress/report persistence |
| Closed local delivery works | Local companion manifest, package-owned tenant branding across the dynamic package runtime and child routes, route fallback, media inventory, PWA/offline readiness, backup/recovery rehearsal, a package-scoped installer/update/recovery continuity packet, a QR registry record stored beside the print artifact, a verified package handoff receipt, a checksum-bound integrity ledger for copied content/media and generated metadata, and a live review-only assembly request preview that names the exact writer inputs; executable isolated assembly/runtime rehearsal proves typed checksum-bound QR print artifacts, registry binding, verified print-sheet HTML reads, handoff identity binding, integrity read-back, fallback mapping, identity-bound front-door to Memory Match route mapping, content/audio/transcript reads, idempotence, custody, and learner-data exclusion | Planning/review-only | Final checksums, rights, offline package, installer/update artifacts, migration/rollback evidence, local data policy, device test evidence, and human production-print authorization |
| Opt-in hosted persistence works | Provider-neutral adapter, SQLite implementation, deployment gate, retention/privacy flags, and report recovery rehearsal | Disabled by default | School policy, retention, cost, provider, tenant isolation, backup/restore, and durable-write approval are recorded |
| White-label packaging is preserved | Tenant-scoped branding, content, language, audio, media, game offer, QR, deployment, policy, pilot command shell, and empty pilot-requirements review contracts; unprovisioned tenants do not inherit Sample Publisher evidence | Foundation-ready | A second publisher package passes the same matrix without MiniStar-only assumptions |
| Outside game source can be integrated safely | Frozen Phaser/Z.ai source remains isolated; candidate profiles and evidence return-package verifier exist | Import blocked | Complete `evidence/return-package.json`, adjudication, wrapper mapping, contract replay, and explicit integration decision |

## Current Decision

### New source-derived evidence checkpoint

The supplied MiniStar curriculum DOCX is now represented in the source-review
workspace as a checksum-bound Unit 1 review for `Genki Disco Warmup`. It
contains the eight source keywords and paragraph provenance. It does not
contain the two target sentence structures required by the canonical content
contract, so this evidence advances source review only; it does not advance
package approval, student payload, QR release, or saleability.

A separate review-only authoring proposal now offers two conservative candidate
sentences, `Stand up, please.` and `Sit down, please.`. They are explicitly
platform-authored proposals, not extracted source text. Teacher approval,
English audio evidence, Japanese support review, media rights, package
integrity, release, QR, and student-assignment gates remain closed.

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

The operational path for completing the remaining human gates is documented in
`docs/PILOT_EXECUTION_RUNBOOK.md`.

## Current Handoff Evidence Boundary

The live publisher handoff now exposes a versioned metadata-only handoff
record. It binds eight evidence identities and names the expected delivery
metadata files, but includes no files until release approval. This strengthens
inspection and auditability without changing the acceptance status: package
assembly, QR printing, persistence activation, and student-facing use remain
blocked. The same record is visible on the Sample Publisher reference handoff,
but that reference tenant remains a review example and does not prove real
publisher release or saleability.

## Source-Derived Unit Boundary

MiniStar Unit 1 now has a source-to-package evidence bridge that binds the real
DOCX-derived evidence to the proposed sentence packet and enumerates the
remaining human evidence lanes. This is a stronger review handoff, not a
package approval: teacher approval, audio, Japanese support, media rights,
game verification, release, QR, and student-use gates remain blocked.
