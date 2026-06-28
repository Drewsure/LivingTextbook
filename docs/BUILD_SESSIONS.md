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

Outputs:

- Any new principle or decision is documented.
- Any recurring workaround is documented.
- Any major architecture choice is entered in the decision register.

## Session 1: First Vertical Slice

Purpose: Prove teacher QR launch, student entry practice, progression events, deterministic rewards, and the first game shell.

Current status: In progress on `legacy-source-import`.

Core path:

Teacher launch -> QR route -> flashcards -> completion event -> reward preview -> Memory Match unlock -> game_started -> pairing shell preview.

## Session 2: Game Engine Foundation

Purpose: Turn the Memory Match shell into the first real `pairing` parent engine implementation.

Required gate:

- Check `docs/GAME_ENGINE_CONTRACTS.md`.
- Check `docs/agent-briefs/MEMORY_MATCH_PAIRING_ENGINE_BRIEF.md`.
- Check public repository research requirement before major reinvention.

Outputs:

- Real Memory Match board.
- Pair selection events.
- Completion events.
- Local scoring loop.
- Mobile verification.

## Session 3: Content Package And PDF Unit Onboarding

Purpose: Support white-label tenant curriculum intake from PDF units, teacher docs, or structured spreadsheets.

Outputs:

- Content package model.
- PDF-derived unit metadata workflow.
- Human review step for imported units.
- AI authoring/verifier integration plan.
- Mapping from textbook page/unit to digital launch payload.

## Session 4: QR Registry And Route Permanence

Purpose: Make QR codes stable enough for printed textbooks and classroom materials.

Outputs:

- Permanent QR id schema.
- Tenant/book/unit/activity route contract.
- Strategy for cloud redirect, local app deep link, and offline fallback.
- Rules forbidding QR codes that point directly to fragile local file paths.

## Session 5: Media Platform Foundation

Purpose: Add a white-label music/audio companion platform without hard-coding any one publisher's assets.

Outputs:

- Audio asset catalog.
- Unit-linked track lists.
- Local/offline media playback plan.
- Teacher and student audio launch routes.
- Rights/ownership metadata fields.

## Session 6: Local/Closed Deployment Mode

Purpose: Package the same platform for closed local use when a publisher, school, or textbook partner needs a non-public installation.

Outputs:

- Local app packaging recommendation.
- Offline asset bundle structure.
- Local storage/sync strategy.
- QR/deep-link behavior for installed apps.
- Update path for future content packages.

## Session 7: Tenant Pilot Package

Purpose: Prepare a real partner pilot without polluting the MiniStar reference implementation.

Outputs:

- Tenant config.
- Sample imported units.
- Sample game payloads.
- Sample audio/music platform payloads.
- Pilot verification checklist.

## Session 8: Premium Experience Layer

Purpose: Add polish only after the vertical slice, content package, QR strategy, and engine foundation are stable.

Outputs:

- Visual asset direction.
- Micro-interactions.
- Avatar/reward presentation.
- Themed game skins.
- Sound feedback.

## Build Session Rule

If a proposed task does not fit one of these sessions, document whether it is:

- a new required session,
- a future requirement,
- a research checkpoint,
- or a distraction from the current foundation path.
