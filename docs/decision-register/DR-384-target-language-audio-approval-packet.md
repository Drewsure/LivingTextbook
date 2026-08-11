Decision: Add a review-only target-language audio approval packet.

Rationale: Young learners need reliable tap-to-speak audio for every learner-facing target-language text item. Generated packages need a specific audio approval surface before teacher review, package assembly, playlists, routes, or assignments can be considered.

White-label impact: Positive. The packet is tenant-scoped and separates universal target-language audio rules from MiniStar-specific English/Japanese support-language rules.

Cost impact: Positive. It keeps voice generation, speech API billing, and package audio-complete markers blocked until tenant approval, storage, and review controls exist.

Blocked actions:
- No audio approval capture.
- No voice generation.
- No speech API billing.
- No package audio-complete marker.
- No route creation from audio packet.
- No playlist creation from audio packet.
- No student assignment from audio packet.
- No media-only progress.
- No support-language progress trigger.

Verification:
- `npm.cmd run verify:ai-generator`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`

Follow-up:
- Add a backend-neutral storage contract for `target_language_audio_approval` before any real approval capture, voice generation, audio attachment, or package audio-complete state exists.
