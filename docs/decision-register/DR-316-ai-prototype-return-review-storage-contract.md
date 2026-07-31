# DR-316: AI Prototype Return Review Storage Contract

Date: 2026-07-31

## Decision

Persist AI prototype return reviews through a backend-neutral storage contract before returned prototype artifacts can affect integration planning or student-facing product surfaces.

## Rationale

External prototype work can help the platform move faster, but only if returned artifacts are reviewed against the LivingTextbook contract. The storage contract makes wrapper fit, fixture conformance, event replay, audio coverage, scoring review, accessibility, white-label fit, and blocked actions durable across hosted and local deployments.

## Required Storage Coverage

- Backend schema entity: `ai_prototype_return_review`.
- Migration candidate and migration spec for prototype return reviews.
- Hosted and local adapter write intents.
- Durable record plan and persistence boundary.
- Verification checks for schema, migrations, adapters, durable records, and active routes.

## Hard Boundaries

- No production merge.
- No route registry write.
- No scoring profile mutation.
- No audio manifest mutation.
- No direct assignment.
- No student-facing prototype preview.
- No support-language-only scoring or release.

## White-Label Impact

This lets MiniStar and future tenants accept prototype returns without making any tenant's game code, mascot, media, language policy, or scoring shortcut universal. Returned prototypes remain evidence until Codex integration review accepts a plan.
