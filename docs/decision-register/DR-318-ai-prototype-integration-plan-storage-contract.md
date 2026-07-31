# DR-318: AI Prototype Integration Plan Storage Contract

Date: 2026-07-31

## Decision

Persist AI prototype integration plans through a backend-neutral storage contract before wrapper adapter work can affect implementation, routes, scoring, audio manifests, package promotion, or assignments.

## Rationale

The integration plan is the bridge between returned prototype evidence and possible app work. It must be durable, auditable, and identical in hosted and local deployments before any engineer or agent can treat it as implementation input.

## Required Storage Coverage

- Backend schema entity: `ai_prototype_integration_plan`.
- Migration candidate and migration spec for prototype integration plans.
- Hosted and local adapter write intents.
- Durable record plan and persistence boundary.
- Verification checks for schema, migrations, adapters, durable records, and active routes.

## Hard Boundaries

- No direct app import.
- No route registry write.
- No game sequence mutation.
- No scoring profile mutation.
- No audio manifest mutation.
- No package promotion.
- No direct assignment.

## White-Label Impact

This keeps future game integrations tenant-safe. Returned prototype work can become a reviewed wrapper candidate for MiniStar or a partner publisher, but no tenant's prototype can silently redefine platform rules.
