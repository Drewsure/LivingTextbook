# Living Textbook Planned Build Sessions

This document gives the project an explicit build-session structure. It should be reviewed when choosing the next work block and updated as the platform matures.

The structure follows the standing rule: foundation first, interaction second, premium polish third.

## Session 0: Standards And Decisions Gate

Purpose: Ensure the project still follows the white-label saleable platform direction before work begins.

Required reads:

- `docs/PRINCIPLES_AND_STANDARDS.md`
- `docs/DECISION_REGISTER.md`
- `docs/FUTURE_REQUIREMENTS.md`
- `docs/OPERATING_NOTES.md`
- `docs/RESEARCH_NOTES_PUBLIC_REPOS.md` when major custom systems or external assets are being considered

Outputs:

- Any new principle or decision is documented.
- Any recurring workaround is documented.
- Any major architecture choice is entered in the decision register.
- Any public-repository or public-asset candidate has license/provenance review before adoption.

## Session 1: First Vertical Slice

Purpose: Prove teacher QR launch, student entry practice, progression events, deterministic rewards, audio-supported learner text, and the first playable game path.

Current status: Implemented as a connector-side local-state slice on `legacy-source-import`; local build/browser verification is still pending because the local checkout is on `main` with no configured remote.

Implemented path:

Teacher launch -> QR route -> flashcards -> tap-to-speak learner text -> completion event -> reward preview -> Memory Match unlock -> game_started -> playable Memory Match -> game_completed -> Star Dust update -> reusable unit-session summary.

Implemented front-door expansion:

Permanent/front-door QR contract -> entry-code/user-code option -> sample multimedia package -> native audio/video playback shell plus manual media progress controls -> optional background media events -> student unit-session summary -> teacher-visible progress summary.

Remaining gate:

- Sync local checkout to `legacy-source-import`.
- Run typecheck/build.
- Run browser/mobile verification against `docs/VERIFICATION_CHECKLIST.md`.

## Session 2: Game Engine Foundation

Purpose: Turn Memory Match into the first reusable `pairing` parent engine implementation and use it as the pattern for future game modes.

Current status: Initial playable pairing implementation exists. Memory Match now uses pairing adapter/state helpers, emits start/completion events, emits item-level `round_shown`, `answer_submitted`, `answer_result`, and `mastery_updated` events, supports card tap-to-hear audio, uses a shared scoring profile, and updates local progression.

Required gate:

- Check `docs/GAME_ENGINE_CONTRACTS.md`.
- Check public repository research requirement before major reinvention.
- Check license/provenance before adopting any outside game code or assets.

Next outputs:

- Local build/browser verification for Memory Match.
- Stronger event metadata if teacher reports need item-level detail.
- Additional scoring profiles for the next selected parent engine or mode.
- Mobile verification.
- Compatibility with optional background/support media without requiring it.

## Session 3: Content Package And PDF Unit Onboarding

Purpose: Support white-label tenant curriculum intake from PDF units, teacher docs, or structured spreadsheets.

Outputs:

- Content package model.
- PDF-derived unit metadata workflow.
- Human review step for imported units.
- AI authoring/verifier integration plan.
- Mapping from textbook page/unit to digital launch payload.
- Mapping from textbook page/unit/activity to multimedia assets and playlists.

## Session 4: QR Registry And Route Permanence

Purpose: Make QR codes stable enough for printed textbooks and classroom materials.

Outputs:

- Permanent QR id schema.
- Tenant/book/unit/activity route contract.
- Front-door entry-code/user-code route contract.
- Strategy for stable registry, optional hosted redirect, local app deep link, and offline fallback.
- Rules forbidding QR codes that point directly to fragile local file paths.

## Session 5: Multimedia Platform Foundation

Purpose: Add a white-label audio/video companion platform as part of the core Living Textbook package without hard-coding any one publisher's assets.

Current status: Sample multimedia content package, route concept, media event stream, native playback shell, manual progress fallback controls, and optional background-media event controls exist. Rights-managed asset storage, pause telemetry, offline/local bundle resolution, and production media management remain future work.

Outputs:

- Audio and video asset catalog.
- Unit-linked playlists.
- Optional unit/game background media settings.
- Native audio/video playback shell.
- Local/offline multimedia playback plan.
- Teacher and student multimedia launch routes.
- Media engagement events.
- Rights/ownership metadata fields.

## Session 6: Local/Closed Deployment Mode

Purpose: Package the same platform for closed local use when a publisher, school, or textbook partner needs a non-public installation.

Outputs:

- Local app packaging recommendation.
- Offline asset bundle structure.
- Local storage/sync strategy.
- QR/deep-link behavior for installed apps.
- Update path for future content packages and multimedia packages.

## Session 7: Tenant Pilot Package

Purpose: Prepare a real partner pilot without polluting the MiniStar reference implementation.

Outputs:

- Tenant config.
- Sample imported units.
- Sample game payloads.
- Sample audio/video platform payloads.
- Sample unit playlist and optional game-background media setting.
- Pilot verification checklist.

## Session 8: Premium Experience Layer

Purpose: Add polish only after the vertical slice, content package, QR strategy, multimedia foundation, and engine foundation are stable.

Outputs:

- Visual asset direction.
- Micro-interactions.
- Avatar/reward presentation.
- Themed game skins.
- Sound feedback.
- Multimedia presentation polish.

## Build Session Rule

If a proposed task does not fit one of these sessions, document whether it is:

- a new required session,
- a future requirement,
- a research checkpoint,
- or a distraction from the current foundation path.

## Next Recommended Build Task

Do not add premium polish yet.

Next concrete task is still to synchronize or repair the local checkout so `legacy-source-import` can be built and visually verified. If connector-only work must continue before that, the next safest structural tasks are pause telemetry for media playback, local/offline bundle resolution contracts, or the next small parent-engine mode config after a public-repository research pass.