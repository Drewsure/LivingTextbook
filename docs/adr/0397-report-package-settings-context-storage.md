# ADR 0397: Report Package Settings Context Storage

## Context

Teacher report package previews now show report-only settings context. Backend-neutral storage contracts also need to preserve this context so future report exports and local handoff packages do not lose the settings profile and teacher settings snapshot used to interpret event rows.

## Decision

Add `settings_context_summary` to teacher report package schema and migration specs, require migration candidates to preserve it, and validate hosted/local write intents and durable records with `preservesSettingsContext`.

## Consequences

Future report package storage has a stronger audit shape. Reports can explain reviewed settings context without enabling export, live report storage, settings save, scoring profile override, support-language progress, media-only progress, or real learner data collection.

## Verification

- `npm run verify:backend-storage`
- `npm run verify:foundation`
