# Upload Channel Readiness Checks

Document type: focused verification supplement
Status: active scaffold
Last updated: 2026-07-14

## Purpose

Verify that upload paths are treated as governed intake channels before live upload controls, object storage, local bundle folders, OCR, media processing, or image label editors are implemented.

## Route

Verify at:

- `http://127.0.0.1:3000/teacher/intake`

## Required Checks

1. Confirm the page shows `Upload channel readiness`.
2. Confirm the page states `Uploads are intake records first`.
3. Confirm the page states `No uploaded file becomes student-facing`.
4. Confirm PDF/text source intake is present.
5. Confirm Image upload for Labelled Diagram is present.
6. Confirm Audio and music upload is present.
7. Confirm Video upload is present.
8. Confirm accepted file types are shown per channel.
9. Confirm upload targets are shown per channel.
10. Confirm not-allowed shortcuts are shown per channel.
11. Confirm PDF/text cannot auto-publish games or assignments.
12. Confirm Labelled Diagram images require rights, safety, alt text, and label-anchor review.
13. Confirm music cannot become a mastery trigger.
14. Confirm video cannot be required for progress without fallback.
15. Confirm the page shows `Upload review queue`.
16. Confirm the page shows `Review queue preview`.
17. Confirm PDF/text, Labelled Diagram image, audio/music, and video review items are visible.
18. Confirm each queue item shows source lineage, rights proof, scan/file policy, and target mapping packet requirements.
19. Confirm reviewer decision options are disabled previews only.
20. Confirm queue rules block student-facing use, direct game assignment, automatic PDF-to-game publish, and uploaded media as mastery trigger.
21. Confirm the page shows `Upload promotion readiness`.
22. Confirm PDF/text, Labelled Diagram image, audio/music, and video/local bundle promotion lanes are visible.
23. Confirm promotion rules block student-facing promotion, direct assignment, folder placement promotion, and reviewed upload bypass.
24. Confirm each promotion lane shows storage required before live promotion.
25. Confirm the page shows `Labelled Diagram asset readiness`.
26. Confirm the page shows `game_asset_manifest` and `label_anchor_record`.
27. Confirm Labelled Diagram assets require image rights proof, alt text, anchor coordinate review, target-language label text, and audio label coverage.
28. Confirm support-language labels are support-only and cannot trigger progress.
29. Confirm the scaffold blocks student-facing image games, auto-generated labels, live label editors, asset promotion without release gate, and unreviewed image coordinates.
30. Confirm the page shows `Multimedia asset readiness`.
31. Confirm the page shows `media_manifest`, `media_playlist_binding`, `background_media_policy_binding`, and `local_media_bundle_entry`.
32. Confirm multimedia assets require learning audio separation, optional playback, captions or transcript policy, background-media priority, and local bundle checksums.
33. Confirm the scaffold blocks media-only progress, background music overriding learning audio, video-only progress, unlicensed media, raw learner audio storage, automatic transcode-to-publish, and local folder activation.

## Automated Command

```powershell
npm run verify:upload-channels
```

This command is also included in:

```powershell
npm run verify:foundation
```

Upload review and promotion storage are also covered by:

```powershell
npm run verify:backend-storage
```

Labelled Diagram asset storage is also covered by `npm run verify:backend-storage`; that verifier must keep `game_asset_manifest`, `label_anchor_record`, image `alt_text`, `label_audio_cue_id`, and `support_language_progress_allowed` in the backend-neutral schema, migration specs, durable records, and hosted/local adapter plans.

## Non-Goals

- This scaffold does not implement file pickers.
- This scaffold does not store uploaded files.
- This scaffold does not run OCR, image labeling, media transcoding, virus scanning, or content moderation.
- This scaffold does not make uploaded files student-facing.
- This scaffold does not approve, publish, import, assign, promote, or process upload queue items.
- This scaffold defines upload review storage contracts only; it does not implement target-specific promotion workflows.
- This scaffold shows target-specific upload promotion readiness only; it does not promote uploads into drafts, game assets, playlists, or local bundles.
- This scaffold defines upload promotion gate storage contracts only; it does not create target records or release uploaded assets.
- This scaffold defines Labelled Diagram asset readiness only; it does not implement a live label editor, coordinate editor, or student-facing image game.
- This scaffold defines Labelled Diagram asset storage contracts only; it does not store live image assets or label anchors yet.
- This scaffold defines multimedia asset readiness only; it does not implement live media uploads, media processing, transcoding, playlist promotion, background-media assignment, or local bundle media activation.
