# Upload Channel Readiness Contract

Document type: foundation contract
Status: active scaffold
Last updated: 2026-07-14

## Purpose

The platform must support controlled uploads for source documents, images, audio, music, and video.

Uploads are intake records first. No uploaded file becomes student-facing until source lineage, rights, file policy, review, audio coverage, route mapping, and package release gates pass.

## Current Sample

Sample data:

- `apps/web/src/data/sampleUploadChannelReadiness.ts`

Panel:

- `apps/web/src/features/content-intake/UploadChannelReadinessPanel.tsx`
- `apps/web/src/features/content-intake/ContentEntryOptionScaffoldPanel.tsx`
- `apps/web/src/features/content-intake/UploadReviewQueuePanel.tsx`
- `apps/web/src/features/content-intake/UploadPromotionReadinessPanel.tsx`
- `apps/web/src/features/content-intake/LabelledDiagramAssetReadinessPanel.tsx`

Upload and target-readiness sample data:

- `apps/web/src/data/sampleUploadReviewQueue.ts`
- `apps/web/src/data/sampleUploadPromotionReadiness.ts`
- `apps/web/src/data/sampleContentEntryOptionScaffold.ts`
- `apps/web/src/data/sampleLabelledDiagramAssetReadiness.ts`

Route:

- `/teacher/intake`

Verifier:

- `npm run verify:upload-channels`

## Required Upload Channels

- PDF and text source intake
- Image upload for Labelled Diagram
- Audio and music upload
- Video upload

## Content Entry Option Scaffold

The teacher-facing content entry panel must offer the practical options teachers expect before live authoring and upload controls are enabled:

- Workflow steps: `Pick a template`, `Enter content`, and `Play`.
- Activity metadata: `Activity title` and `+ Instruction`.
- Teacher helpers: `Generate With AI` and `Flip tiles`.
- Card shape controls: `Single sided` and `Double sided`.
- Row editor columns: `Front`, `Back`, target-language text, and support-language text.
- Row limits: `min 2 max 50`.
- Formatting tools: `Bold`, `Superscript`, `Subscript`, and `Symbol picker`.
- Row actions: `Audio cue`, `Image upload`, `Reorder item`, `Duplicate item`, and `Delete item`.
- Authoring action: `+ Add an item`.
- Completion action: `Done`.

These controls are foundation previews only. They must create draft/review intent records, not live uploads, student assignments, public routes, or released game assets.

Standing blocks:

- No live media upload.
- No Done-to-student route.
- No direct AI publish.
- No unreviewed image activation.
- No support-language progress trigger.
- No file picker writes.
- No template switch without compatibility check.

## Standing Rules

- Upload controls must not bypass review.
- Content entry controls must not bypass draft, compatibility, rights, audio, review, and release gates.
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

## Upload Promotion Readiness

Reviewed uploads still need target-specific promotion gates before they can become platform assets.

Promotion lanes:

- PDF/text to draft package.
- Labelled Diagram asset promotion.
- Audio/music playlist promotion.
- Video/local bundle promotion.

Standing blocks:

- No student-facing promotion.
- No direct assignment.
- No folder placement promotion.
- No reviewed upload bypass.

Each lane must name required gates, current blockers, preview-only actions, not-allowed shortcuts, and storage required before live promotion.

## Labelled Diagram Asset Readiness

Labelled Diagram images are a target-specific game-asset case. A reviewed image upload cannot become a student-facing Labelled Diagram game until both target records are defined:

- `game_asset_manifest`
- `label_anchor_record`

These are backend-neutral storage contracts, not live editor features. Hosted and local implementations must preserve the same two records before any image-game asset library, coordinate editor, label editor, or student-facing Labelled Diagram route is enabled.

`game_asset_manifest` must preserve source upload lineage, upload review lineage, promotion gate lineage, image metadata, rights proof, alt text, target language, review status, release gate status, and a student-facing asset block.

`label_anchor_record` must preserve target-language label text, support-language support-only text, reviewed anchor geometry, label audio cue id, label review status, a support-language progress block, and a student-facing anchor block.

Required readiness:

- Image rights proof.
- Alt text required.
- Image safety review.
- Anchor coordinate review.
- Target-language label text.
- Audio label coverage.
- Support-language labels are support-only.
- Asset release gate required.

Standing blocks:

- No student-facing image game.
- No auto-generated labels.
- No live label editor.
- No asset promotion without release gate.
- No support-language progress trigger.
- No unreviewed image coordinates.

## Multimedia Asset Readiness

Audio, music, video, posters, captions, playlists, background media, and local bundle media are target-specific media cases. A reviewed media upload cannot become an active unit asset until the required manifest and binding records are defined:

- `media_manifest`
- `media_playlist_binding`
- `background_media_policy_binding`
- `local_media_bundle_entry`

Required readiness:

- Media rights proof.
- Learning audio separation.
- Optional playback required.
- Captions or transcript required for video policy.
- Poster or fallback required for video.
- Background media cannot override learning audio.
- Local bundle checksum and relative path required.
- No media-only progress.

Standing blocks:

- No media-only progress.
- No background music overriding learning audio.
- No required progress through video only.
- No unlicensed media.
- No raw learner audio storage.
- No automatic transcode-to-publish.
- No local folder activation.

## Follow-Up

The backend-neutral storage contract now includes `upload_review_decision` records. Hosted and local adapters must preserve upload review packets and keep upload promotion blocked.

Add target-specific promotion records before live approve-for-draft, ready-for-asset-review, return-for-replacement, rights-request, OCR promotion, image-label promotion, media playlist promotion, or local-bundle promotion workflows are implemented.

The backend-neutral storage contract now includes `upload_promotion_gate` records. Hosted and local adapters must preserve target-specific promotion gates and keep student-facing promotion blocked until target records, target review, and release-control policy exist.

The backend-neutral storage contract now includes `game_asset_manifest` and `label_anchor_record` records. Hosted and local adapters must preserve image rights, alt text, reviewed label anchors, target-language label audio coverage, and support-language non-progress behavior before Labelled Diagram assets can become student-facing.

The backend-neutral storage contract now includes `media_manifest`, `media_playlist_binding`, `background_media_policy_binding`, and `local_media_bundle_entry` records. Hosted and local adapters must preserve media rights, optional playback, non-mastery playlist policy, learning-audio priority, teacher background-media controls, checksums, relative paths, update rules, and local activation blocks before live upload promotion into playlists, game background media, or local bundle media is enabled.

The content entry option scaffold must stay visible in `/teacher/intake` until a real authoring workbench replaces it. When live controls are introduced, they must still preserve teacher draft packages, review handoff records, upload intake/review/promotion records, media/game asset manifests, and activity compatibility snapshots before student assignment.

The backend-neutral storage contract includes `upload_intake_asset` records. Hosted and local adapters must preserve upload source lineage and block student-facing uploaded file use until file policy, rights, review, route mapping, audio coverage, and release gates pass.
