# DR-314: AI Generated Game Build Brief Storage Contract

Date: 2026-07-31

## Decision

Persist AI generated game build briefs through a backend-neutral storage contract before they can be used for prototype handoff or future integration review.

## Rationale

The platform can use low-cost external builders for isolated prototypes, but build instructions must remain governed. Persisting the brief keeps the target mode, parent engine, JSON fixture, audio, events, scoring, deliverables, and blocked actions auditable across hosted and local deployment paths.

## Required Storage Coverage

- Backend schema entity: `ai_generated_game_build_brief`.
- Migration candidate and migration spec for generated game build briefs.
- Hosted and local adapter write intents.
- Durable record plan and persistence boundary.
- Verification checks for schema, migrations, adapters, durable records, and active routes.

## Hard Boundaries

- No standalone game promotion.
- No Phaser bypass.
- No generated game route write.
- No scoring profile override.
- No direct student assignment.
- No media-only progress shortcut.
- No support-language-only scoring or release.

## White-Label Impact

This keeps outside game work portable across tenants. MiniStar can use the same brief pattern as a flagship tenant, while future publishers can generate tenant-specific prototype briefs without hard-coding MiniStar rules into the platform.
