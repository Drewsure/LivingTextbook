# DR-466: Progress Event Settings Context

## Status

Accepted.

## Decision

Progress event envelopes must carry `settings_context` before any future live event storage or teacher report export can be considered.

The settings context records the active game mode settings profile, the teacher session settings snapshot, and the settings contract used for the event. It is report context only. It cannot grant mastery, Star Dust, unlocks, support-language progression, media-only progression, or scoring profile overrides.

## Rationale

Teachers and schools will need to understand which reviewed settings were active when a learner completed an activity. That becomes especially important once white-label tenants can adjust timers, difficulty, audio, background media, and premium options.

Keeping this context inside the standard envelope gives reports a durable audit trail without letting settings become the scoring authority. The parent engine, target-language event taxonomy, and accepted event gate remain the source of truth for progress.

## Guardrails

- `progress_trigger_policy` must remain `target-language-only`.
- `support_language_progress_allowed` must be `false`.
- `media_only_progress_allowed` must be `false`.
- `scoring_profile_override_allowed` must be `false`.
- Backend schema drafts, migration specs, adapter write intents, and durable record contracts must preserve settings context before progress event storage is considered.
- Settings context is required before storage, but it remains preview-only until persistence, policy, launch, and report gates close.

## Verification

- `npm run verify:taxonomy`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run verify:foundation`
