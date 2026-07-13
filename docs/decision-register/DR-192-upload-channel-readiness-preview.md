# DR-192: Upload Channel Readiness Preview

## Decision

Add a foundation upload channel readiness preview for source documents, images, audio/music, and video.

## Rationale

White-label partners and schools will need to upload textbook PDFs, text data, labelled-diagram images, audio, music, and video. Generic upload controls would be unsafe because files need source lineage, rights, scan/type/size policy, review, game mapping, media mapping, and release gates.

## Implications

- `/teacher/intake` shows upload channels before live upload controls exist.
- Labelled Diagram image upload is treated as a game-asset channel with image rights and label-anchor review.
- Audio/music and video uploads are media channels with rights, fallback, and local/offline bundle policy.
- PDF/text upload creates drafts only and cannot auto-publish games or assignments.

## Next

Add durable upload intake storage records before object storage, local bundle upload folders, OCR pipelines, media processing, image label editors, or live file pickers are implemented.
