# DR-540: Tenant-Aware Media Library Preview

Status: Accepted

Decision: Add a MiniStar media library preview and make the shared teacher media route resolve tenant branding before rendering.

Rationale:

- Audio, music, video, playlists, background media, and local bundle media are core Living Textbook package materials, not add-ons.
- MiniStar needs the same media-maintenance review surface as the white-label sample publisher tenant.
- Tenant-aware media headings prevent partner-only or MiniStar-only assumptions from leaking into shared platform surfaces.

Guardrails:

- `/teacher/media/ministar` and `/teacher/media/sample-publisher` are review-only.
- No live upload, replacement, transcoding, storage write, playlist promotion, background-media assignment, local folder activation, report export, or student assignment is enabled.
- Target-language learner audio remains required and cannot be replaced by video, background music, or support-language audio.
- MiniStar Japanese support remains hiragana-only for Foundation/Bronze/Plus and cannot unlock progress.
- Active route and upload-channel verification must protect both media library previews.

Verification:

- `npm.cmd run verify:upload-channels`
- `npm.cmd run verify:ai-generator`
- `npm.cmd run verify:review-keys`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`
