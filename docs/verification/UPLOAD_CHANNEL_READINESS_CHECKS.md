# Upload Channel Readiness Checks

Document type: focused verification supplement
Status: active scaffold
Last updated: 2026-07-13

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

## Automated Command

```powershell
npm run verify:upload-channels
```

This command is also included in:

```powershell
npm run verify:foundation
```

Upload review storage is also covered by:

```powershell
npm run verify:backend-storage
```

## Non-Goals

- This scaffold does not implement file pickers.
- This scaffold does not store uploaded files.
- This scaffold does not run OCR, image labeling, media transcoding, virus scanning, or content moderation.
- This scaffold does not make uploaded files student-facing.
- This scaffold does not approve, publish, import, assign, promote, or process upload queue items.
- This scaffold defines upload review storage contracts only; it does not implement target-specific promotion workflows.
