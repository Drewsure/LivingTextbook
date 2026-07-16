# Active Route Verification Checks

Run after adding or changing routes.

## Required Local Checks

- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web`
- `npm run verify:routes`

When the local dev server is already running, these can be run together:

- `npm run verify:foundation`

## Minimum Browser Checks

Open:

- `http://127.0.0.1:3000/`
- `http://127.0.0.1:3000/teacher/intake`
- `http://127.0.0.1:3000/launch/demo-unit-1`
- `http://127.0.0.1:3000/training/demo-unit-1?focus=sentence-review`
- `http://127.0.0.1:3000/launch/partner-demo-unit-1`
- `http://127.0.0.1:3000/teacher/sessions/demo-unit-1`
- `http://127.0.0.1:3000/teacher/sessions/partner-demo-unit-1`
- `http://127.0.0.1:3000/q/tenant/sample-publisher/series/starter-english/book/level-1/unit/unit-1/activity/hello-friends/language/en/edition/2026/version/1.0.0`

## Product Checks

- Routes load without 500 errors.
- Key routes also confirm expected page text, including student launch unit media, teacher intake publish gate, media playlist route, media demo controls, and teacher session media engagement.
- The teacher upload workspace route confirms disabled intake controls, upload channel, file policy, target mapping, review, promotion, Labelled Diagram asset, multimedia asset, and no-live-file-picker boundaries.
- The evidence packet review index route confirms upload, Labelled Diagram, and media evidence rollups while live evidence upload, signed approval, publish/promotion, playlist creation, and assignment remain blocked.
- The evidence packet review index route confirms the evidence packet assembly gate, including release readiness lanes, blocked packet-version freeze, blocked approval capture, blocked export generation, blocked QR promotion, blocked route promotion, blocked local bundle activation, blocked storage writes, and blocked student assignment creation.
- The evidence packet review index route confirms the reviewer identity and signature gate, including blocked reviewer identity, preview-only approval intent, signature policy rules, blocked signature attachments, blocked signed PDF packets, and blocked student assignment from approval.
- The evidence packet handoff route confirms export packet shape, recipient duties, next gates, and blocked export/signature/publish/promotion/route/playlist/assignment behavior.
- The teacher intake route confirms evidence export readiness, including blocked PDF, JSON, local manifest, signature, email handoff, release-state mutation, and student-assignment behavior.
- The teacher intake route confirms evidence attachment storage readiness and backend storage records, including `evidence_attachment`, hosted object storage, closed local evidence folder, hybrid export archive, quarantine/checksum/malware/retention/delete-policy metadata, and blocked upload/write/download/signature/release/student-facing behavior.
- The teacher intake route confirms evidence storage adapter selection, including hosted managed first-pilot recommendation, closed local and hybrid alternatives, vendor-neutral requirements, and blocked bucket/folder/signed-url/upload/migration/retention actions.
- The Labelled Diagram asset workspace confirms teacher-only image review, `game_asset_manifest`, `label_anchor_record`, `target_mapping_packet`, target-language audio coverage, support-language non-progress, and blocked live label/editor/student-game actions.
- The media asset workspace confirms teacher-only media review, `media_manifest`, `media_playlist_binding`, `background_media_policy_binding`, `local_media_bundle_entry`, optional playback, learning-audio priority, media-only progress blocking, and blocked live upload/transcode/playlist actions.
- Playable routes confirm activity shell text for Training Academy, Quiz, Sentence Builder, and Speak It, including tenant-specific themes where needed.
- Student routes preserve target-language progression gates.
- Teacher/admin routes do not imply live production storage unless persistence is accepted.
- Sample publisher routes remain white-label and do not depend on MiniStar-only branding.
- Stable QR alias route resolves through the route registry concept, not a direct media file.
- Planned QR routes marked `stableQrReady: false` may return 404 and must not be listed as active routes.
