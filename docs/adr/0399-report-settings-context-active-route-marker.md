# ADR 0399: Report Settings Context Active Route Marker

## Context

`settings_context_summary` is now required in teacher report package schema and migration specs. The admin intake route renders schema fields as a review surface.

## Decision

Require `settings_context_summary` in the active route verifier for `/teacher/intake`.

## Consequences

Future edits that hide the report package settings context storage marker from the admin review surface will fail route verification. No live report export or storage behavior is enabled.

## Verification

- `npm run verify:backend-storage`
- `npm run verify:routes`
