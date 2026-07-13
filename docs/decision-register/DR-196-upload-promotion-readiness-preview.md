# DR-196: Upload Promotion Readiness Preview

## Decision

Add a read-only target-specific promotion readiness preview for uploaded files.

## Rationale

White-label partners will upload PDFs, images, audio/music, and video. The platform needs to show how those files can eventually become reviewed assets without letting upload review imply live promotion.

## Implications

- `/teacher/intake` shows promotion lanes for draft packages, Labelled Diagram assets, media playlists, and local bundles.
- Promotion remains blocked even after intake and review previews exist.
- No direct assignment, automatic PDF-to-game publish, folder placement promotion, or reviewed upload bypass is allowed.
- Future storage work must define target-specific promotion records before live workflows.

## Next

Add promotion storage contracts only after the draft package, game asset, media playlist, and local bundle target shapes are stable enough to store.
