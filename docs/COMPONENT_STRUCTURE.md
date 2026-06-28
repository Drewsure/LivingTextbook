# Component Structure

This document records the first clean structure for the white-label Living Textbook web app. It follows `docs/PRINCIPLES_AND_STANDARDS.md`: foundation first, polish later.

## Layers

- `packages/content-model` owns shared platform types, sample payload validation, game event names, launch/progression contracts, audio support contracts, multimedia package contracts, permanent QR contracts, and Star Dust calculations.
- `packages/ui` owns small reusable UI primitives with stable dimensions and accessible defaults.
- `apps/web` owns the Next.js application shell, routes, tenant configuration, local adapters, and feature composition.

## App Boundaries

- `apps/web/src/app` contains routes only.
- `apps/web/src/components` contains app-level reusable layout.
- `apps/web/src/features` contains domain features: teacher launch, student onboarding, audio support, game shell, progression, rewards, tenant config, front-door access, multimedia, and reporting surfaces.
- `apps/web/src/data` contains static seed data until live persistence is chosen.

## Tenant Styling Boundary

Tenant identity enters the app through `TenantConfig`. The app shell converts `TenantConfig.brand` into CSS variables, and shared primitives consume those variables. This keeps MiniStar as the flagship tenant without making MiniStar colors, rewards, avatars, media rules, voices, pronunciation choices, or curriculum assumptions universal platform code.

## Student Launch Structure

`StudentLaunchFlow` is the client-side orchestrator for the first QR-entry slice. It owns temporary local state and delegates display to focused components:

- `StudentProgressHeader` shows launch context and current progression facts.
- `FlashcardPracticeCard` renders entry practice, clickable learner text for terms/sentences, and completion.
- `RewardPreviewCard` shows deterministic earned collection progress from Star Dust.
- `NextGameUnlockCard` shows the next recommended mode and lock/unlock state.
- `PairingMemoryMatchGame` renders the first playable post-flashcard game slice.
- `SessionEventLog` shows emitted local progress events.

Local progression logic belongs in `apps/web/src/features/progression/localProgressionAdapter.ts` until persistence is intentionally introduced.

## Audio Support Structure

Audio support lives in `apps/web/src/features/audio`, not inside individual game engines.

Current sample components:

- `AudioCueText` renders learner-facing text as the preferred tap/click-to-speak control using browser speech synthesis as the first cost-efficient fallback.
- `AudioCueButton` remains available for cases where text-as-control would be unclear, crowded, or inaccessible.
- `AudioSupportedAction` pairs a listen/replay control with a real action button so children can hear the action label without triggering the action.
- `playAudioCueText` provides the shared speech helper used by game cards and text controls.

Responsibilities:

- Make learner-facing text itself the preferred listen/replay control.
- Provide separate listen/replay controls when text-as-control is not appropriate.
- Keep autoplay opt-in, disable-able, and limited to specific activity designs such as first-card reveal, listening drills, accessibility settings, or teacher-led presentation mode.
- Accept cue text, language, and future cue metadata without hard-coding MiniStar voices or vendor choices.
- Allow future replacement with recorded tenant audio, teacher-recorded audio, partner-provided audio, or offline bundled audio.
- Keep comprehension audio separate from optional background music or chants.
- Let parent game engines consume audio cue ids through standardized payloads instead of one-off playback code.

## Front-Door Access Structure

Front-door access lives in `apps/web/src/features/access`, not inside game or media components.

Current sample components:

- `FrontDoorEntryFlow` renders the sample tenant front door, entry-code/user-code form, and unit package flow.
- `FrontDoorTeacherReportPreview` summarizes the same local event stream for teacher visibility.

Responsibilities:

- Render tenant-branded entry code/user code forms.
- Resolve front-door access into a launch session.
- Keep printed QR identifiers stable and non-private.
- Preserve teacher reporting links without forcing heavy student accounts too early.
- Keep route state local until persistence is intentionally introduced.

## Multimedia Structure

Multimedia work lives in `apps/web/src/features/multimedia`, not inside individual games.

Current sample components:

- `MultimediaPackagePanel` renders the dashboard package concept, including audio cue counts and support-plan status.
- `UnitMediaEngagementPanel` renders unit playlist/media event controls for the active front-door slice.

Responsibilities:

- Render unit playlists and media cards.
- Render audio/video player controls when real playback is introduced.
- Emit media started, paused, completed, background enabled, and background disabled events.
- Keep media engagement separate from game mastery scoring.
- Coordinate optional background/support media for games through a small adapter, not direct game-player coupling.
- Respect tenant media rules, rights metadata, accessibility, and local/offline availability.

## Reward Structure

`apps/web/src/features/rewards/rewardCatalog.ts` is the first deterministic reward catalog boundary. Rewards should remain earned, transparent, and tenant-configurable. Random or pressure-based reward mechanics are not part of the foundation slice.

## Game Shell Structure

`apps/web/src/features/game-shell/gameModeCatalog.ts` is the first mode metadata boundary. Early mode definitions should describe:

- stable mode id
- readable label
- pedagogical family
- parent engine
- role in the learning flow
- concise purpose summary
- audio cue requirements for learner-facing text

Pairing engine files:

- `pairingEngineAdapter.ts` maps unit vocabulary into reusable pairing items.
- `pairingEngineState.ts` owns reusable pairing card state, selection, matching, attempts, and completion.
- `PairingMemoryMatchGame.tsx` renders the first playable Memory Match mode using the pairing state and audio helper.
- `PairingEnginePreview.tsx` remains useful for non-playable mode wiring checks and future engine previews.

`GameSequence` should read from this catalog instead of scattering mode metadata across screens. Real game engines should not be promoted from legacy code or external repositories until `docs/GAME_ENGINE_CONTRACTS.md` and the legacy promotion standard are satisfied.

Games may accept optional background/support media through a standard multimedia plan, but the game engine must not require that media to be playable. Games must still support comprehension audio for learner-facing text.

## Reporting Structure

Teacher reporting remains a future persistence/backend concern, but the active front-door slice now previews report shape through local events.

Expected reporting streams:

- launch opened
- entry practice completed
- game started/completed
- media started/paused/completed
- background media enabled/disabled
- audio cue engagement when telemetry is implemented
- Star Dust or tenant reward progress
- mastery state updates
- Training Academy recommendations

## Current Rules

- No legacy component is promoted directly into the canonical app until an explicit integration plan exists.
- No external code or assets are promoted into the canonical app until `docs/RESEARCH_NOTES_PUBLIC_REPOS.md` records license, provenance, white-label fit, and integration review.
- No reusable component should hard-code a tenant palette, mascot, reward name, media rule, voice, pronunciation rule, autoplay default, or curriculum identity.
- Premium polish, animation, mascot evolution, and asset-heavy collection views come after the clean vertical slice works.
- Client components should be thin orchestrators where possible; display should live in named domain components.
- New game modes should begin as catalog entries and parent-engine configurations, not one-off screens.
- New game modes must include tap/click-to-speak audio support for learner-facing text before they are student-ready.
- Rewards should begin as deterministic catalog entries and mastery thresholds, not random reward systems.
- Multimedia should begin as catalog entries, playlists, and events, not one-off music/video pages.