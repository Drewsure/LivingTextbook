# Component Structure

This document records the first clean structure for the white-label Living Textbook web app. It follows `docs/PRINCIPLES_AND_STANDARDS.md`: foundation first, polish later.

## Layers

- `packages/content-model` owns shared platform types, sample payload validation, game event names, launch/progression contracts, and Star Dust calculations.
- `packages/ui` owns small reusable UI primitives with stable dimensions and accessible defaults.
- `apps/web` owns the Next.js application shell, routes, tenant configuration, local adapters, and feature composition.

## App Boundaries

- `apps/web/src/app` contains routes only.
- `apps/web/src/components` contains app-level reusable layout.
- `apps/web/src/features` contains domain features: teacher launch, student onboarding, game shell, progression, rewards, and tenant config.
- `apps/web/src/data` contains static seed data until live persistence is chosen.

## Tenant Styling Boundary

Tenant identity enters the app through `TenantConfig`. The app shell converts `TenantConfig.brand` into CSS variables, and shared primitives consume those variables. This keeps MiniStar as the flagship tenant without making MiniStar colors, rewards, avatars, or curriculum assumptions universal platform code.

## Student Launch Structure

`StudentLaunchFlow` is the client-side orchestrator for the first QR-entry slice. It owns temporary local state and delegates display to focused components:

- `StudentProgressHeader` shows launch context and current progression facts.
- `FlashcardPracticeCard` renders entry practice and triggers completion.
- `RewardPreviewCard` shows deterministic earned collection progress from Star Dust.
- `NextGameUnlockCard` shows the next recommended mode and lock/unlock state.
- `SessionEventLog` shows emitted local progress events.

Local progression logic belongs in `apps/web/src/features/progression/localProgressionAdapter.ts` until persistence is intentionally introduced.

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

`GameSequence` should read from this catalog instead of scattering mode metadata across screens. Real game engines should not be promoted from legacy code or external repositories until `docs/GAME_ENGINE_CONTRACTS.md` and the legacy promotion standard are satisfied.

## Current Rules

- No legacy component is promoted directly into the canonical app until an explicit integration plan exists.
- No reusable component should hard-code a tenant palette, mascot, reward name, or curriculum identity.
- Premium polish, animation, mascot evolution, and asset-heavy collection views come after the clean vertical slice works.
- Client components should be thin orchestrators where possible; display should live in named domain components.
- New game modes should begin as catalog entries and parent-engine configurations, not one-off screens.
- Rewards should begin as deterministic catalog entries and mastery thresholds, not random reward systems.
