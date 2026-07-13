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
- PDF/text extraction creates drafts only.
- Uploaded images need ownership, classroom-safety review, alt text, and label anchors before Labelled Diagram assignment.
- Uploaded audio/music can enrich a unit, but learner-critical term, sentence, and instruction audio remain separately reviewable.
- Background music cannot become a mastery trigger.
- Uploaded video must be optional to core game progression and needs poster/caption/transcript policy.
- Local/offline bundle use requires explicit rights and packaging policy.
- Raw learner audio and learner transcripts stay out of the core upload scaffold.

## Follow-Up

Add durable upload intake storage records before live file pickers, object storage, local bundle upload folders, OCR pipelines, image label editors, or media processing workflows are implemented.

The backend-neutral storage contract includes `upload_intake_asset` records. Hosted and local adapters must preserve upload source lineage and block student-facing uploaded file use until file policy, rights, review, route mapping, audio coverage, and release gates pass.
