# Component Structure

This document records the first clean structure for the white-label Living Textbook web app. It follows `docs/PRINCIPLES_AND_STANDARDS.md`: foundation first, polish later.

## Layers

- `packages/content-model` owns shared platform types, sample payload validation, game event names, launch/progression contracts, audio support contracts, multimedia package contracts, permanent QR contracts, AI Tutor entitlement contracts, and Star Dust calculations.
- `packages/ui` owns small reusable UI primitives with stable dimensions and accessible defaults.
- `apps/web` owns the Next.js application shell, routes, tenant configuration, local adapters, and feature composition.

## App Boundaries

- `apps/web/src/app` contains routes only.
- `apps/web/src/components` contains app-level reusable layout.
- `apps/web/src/features` contains domain features: teacher launch, student onboarding, audio support, game shell, progression, rewards, tenant config, front-door access, multimedia, package entitlement display, and reporting surfaces.
- `apps/web/src/data` contains static seed data until live persistence is chosen.

## Tenant Styling Boundary

Tenant identity enters the app through `TenantConfig`. The app shell converts `TenantConfig.brand` into CSS variables, and shared primitives consume those variables. This keeps MiniStar as the flagship tenant without making MiniStar colors, rewards, avatars, media rules, voices, pronunciation choices, or curriculum assumptions universal platform code.

Tenant package availability enters through `TenantConfig.featureEntitlements`. This is separate from brand styling. AI Tutor availability must be read from tenant/package entitlement and content-package tutor plans, not hard-coded into game screens or student routes.

## AI Tutor Entitlement Structure

AI Tutor is a planned upper-level premium capability, not a baseline student-flow dependency.

Current code boundaries:

- `packages/content-model/src/index.ts` defines `AiTutorEntitlement`, `TenantFeatureEntitlements`, `UnitAiTutorPlan`, `AiTutorModeId`, and validation helpers.
- `apps/web/src/features/tenant/types.ts` allows tenants to expose optional `featureEntitlements`.
- `apps/web/src/features/tenant/ministarTenant.ts` keeps MiniStar AI Tutor disabled by default as a premium package option.
- `apps/web/src/data/sampleMultimediaPackage.ts` includes a disabled `aiTutorPlans` entry for the Level 1 sample package.
- `MultimediaPackagePanel` displays AI Tutor package status alongside QR, audio, and optional background media package metadata.

Rules:

- Do not build active tutor UI, model calls, speech services, billing logic, or student chat routes before the foundation slice is locally verified.
- Core QR launch, audio flashcards, games, multimedia, rewards, and teacher reporting must work when AI Tutor is disabled.
- AI Tutor availability must come from tenant entitlement plus unit/package plan.
- Enabled plans must require premium or enterprise entitlement.
- Disabled states must be clean and must not block normal student progression.

## Student Launch Structure

`StudentLaunchFlow` is the client-side orchestrator for the first QR-entry slice. It owns temporary local state and delegates display to focused components:

- `StudentProgressHeader` shows launch context and current progression facts.
- `UnitSessionProgressSummary` shows flashcard, next-game, media, background-media, reward, and event state from the shared local event stream.
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

- `FrontDoorEntryFlow` renders the sample tenant front door, entry-code/user-code form, unit package flow, and reusable unit-session summary.
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

- `MultimediaPackagePanel` renders the dashboard package concept, including audio cue counts, support-plan status, and optional AI Tutor package status.
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

`apps/web/src/features/game-shell/gameModeCatalog.ts` is the first mode metadata boundary. Early mode definitions describe:

- stable mode id
- readable label
- pedagogical family
- parent engine
- role in the learning flow
- skill focus
- supported levels
- recommended term range
- required sentence count
- scoring profile id
- audio requirement
- background-media allowance
- concise purpose summary

`apps/web/src/features/game-shell/scoringProfiles.ts` owns shared scoring profiles for game modes. Game components should ask the scoring layer for award limits or accuracy-sensitive reward calculations instead of hard-coding Star Dust math inside each mode component.

Pairing engine files:

- `pairingEngineAdapter.ts` maps unit vocabulary into reusable pairing items.
- `pairingEngineState.ts` owns reusable pairing card state, selection, matching, attempts, and completion.
- `PairingMemoryMatchGame.tsx` renders the first playable Memory Match mode using the pairing state, shared scoring profile, standard telemetry events, and audio helper.
- `PairingEnginePreview.tsx` remains useful for non-playable mode wiring checks and future engine previews.

`GameSequence` should read from this catalog instead of scattering mode metadata across screens. Real game engines should not be promoted from legacy code or external repositories until `docs/GAME_ENGINE_CONTRACTS.md` and the legacy promotion standard are satisfied.

Games may accept optional background/support media through a standard multimedia plan, but the game engine must not require that media to be playable. Games must still support comprehension audio for learner-facing text.

## Reporting Structure

Teacher reporting remains a future persistence/backend concern, but the active front-door slice now previews report shape through local events.

Expected reporting streams:

- launch opened
- entry practice completed
- game started/completed
- round/item shown
- answer submitted
- answer result
- media started/paused/completed
- background media enabled/disabled
- audio cue engagement when telemetry is implemented
- Star Dust or tenant reward progress
- mastery state updates
- Training Academy recommendations
- AI Tutor session summaries only when a tenant has enabled the premium package

## Current Rules

- No legacy component is promoted directly into the canonical app until an explicit integration plan exists.
- No external code or assets are promoted into the canonical app until `docs/RESEARCH_NOTES_PUBLIC_REPOS.md` records license, provenance, white-label fit, and integration review.
- No reusable component should hard-code a tenant palette, mascot, reward name, media rule, voice, pronunciation rule, autoplay default, package entitlement, or curriculum identity.
- Premium polish, animation, mascot evolution, and asset-heavy collection views come after the clean vertical slice works.
- Client components should be thin orchestrators where possible; display should live in named domain components.
- New game modes should begin as catalog entries, scoring profiles, and parent-engine configurations, not one-off screens.
- New game modes must include tap/click-to-speak audio support for learner-facing text before they are student-ready.
- Rewards should begin as deterministic catalog entries and mastery thresholds, not random reward systems.
- Multimedia should begin as catalog entries, playlists, and events, not one-off music/video pages.
- AI Tutor should begin as tenant entitlements and content-package plans, not active chat UI or model calls.
