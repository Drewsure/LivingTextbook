# DR-194: Upload Review Queue Preview

## Decision

Add a read-only upload review queue preview between upload intake records and any future draft, asset, media, local bundle, or assignment use.

## Rationale

Uploads are foundational for white-label textbook partners, but raw files cannot be trusted as student-facing content. A review queue makes the required packets and blocked shortcuts explicit before live file workflows are built.

## Implications

- `/teacher/intake` shows PDF/text, Labelled Diagram image, audio/music, and video queue examples.
- Reviewer actions are preview-only or blocked.
- Uploads cannot directly become games, assignments, playlists, or local bundle assets.
- Future storage work must add durable review records before real upload promotion.

## Next

Add a durable upload review storage contract before implementing live approve-for-draft, ready-for-asset-review, rights-request, return-for-replacement, OCR promotion, image-label promotion, media playlist promotion, or local-bundle promotion actions.
