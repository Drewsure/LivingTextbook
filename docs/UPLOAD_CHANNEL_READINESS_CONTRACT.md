# Upload Channel Readiness Contract

Document type: foundation contract
Status: active scaffold
Last updated: 2026-07-13

## Purpose

The platform must support controlled uploads for source documents, images, audio, music, and video.

Uploads are intake records first. No uploaded file becomes student-facing until source lineage, rights, file policy, review, audio coverage, route mapping, and package release gates pass.

## Current Sample

Sample data:

- `apps/web/src/data/sampleUploadChannelReadiness.ts`

Panel:

- `apps/web/src/features/content-intake/UploadChannelReadinessPanel.tsx`
- `apps/web/src/features/content-intake/UploadReviewQueuePanel.tsx`

Review queue sample:

- `apps/web/src/data/sampleUploadReviewQueue.ts`

Route:

- `/teacher/intake`

Verifier:

- `npm run verify:upload-channels`

## Required Upload Channels

- PDF and text source intake
- Image upload for Labelled Diagram
- Audio and music upload
- Video upload

## Standing Rules

- Upload controls must not bypass review.
- Upload review queue previews must not approve, assign, publish, import, promote, or make assets student-facing.
- PDF/text extraction creates drafts only.
- Uploaded images need ownership, classroom-safety review, alt text, and label anchors before Labelled Diagram assignment.
- Uploaded audio/music can enrich a unit, but learner-critical term, sentence, and instruction audio remain separately reviewable.
- Background music cannot become a mastery trigger.
- Uploaded video must be optional to core game progression and needs poster/caption/transcript policy.
- Local/offline bundle use requires explicit rights and packaging policy.
- Raw learner audio and learner transcripts stay out of the core upload scaffold.

## Upload Review Queue

The upload review queue is the required bridge between intake channels and later source drafts, game assets, media playlists, or local bundles.

Each queue item must preserve:

- Source lineage packet.
- Rights proof packet.
- Scan and file policy packet.
- Target mapping packet.

The foundation preview may show decision options such as `Approve for draft`, `Ready for asset review`, `Needs rights proof`, and `Return for replacement`, but those options remain disabled until reviewer identity, audit trail, evidence storage, target-specific asset review, and release-control gates exist.

Standing blocks:

- Student-facing use blocked.
- No direct game assignment.
- No automatic PDF-to-game publish.
- No uploaded media as mastery trigger.

## Follow-Up

Add durable upload review records before live approve-for-draft, ready-for-asset-review, return-for-replacement, rights-request, OCR promotion, image-label promotion, media playlist promotion, or local-bundle promotion workflows are implemented.

The backend-neutral storage contract includes `upload_intake_asset` records. Hosted and local adapters must preserve upload source lineage and block student-facing uploaded file use until file policy, rights, review, route mapping, audio coverage, and release gates pass.
