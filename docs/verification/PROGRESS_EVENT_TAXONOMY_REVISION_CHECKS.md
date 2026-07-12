# Progress Event Taxonomy Revision Checks

## Scope

Run after taxonomy, game event, media event, speaking event, AI Tutor event, reward event, backend schema, migration, or report export work.

## Checks

- Confirm `/teacher/intake` shows `taxonomy-v2026.07.foundation`.
- Confirm `/teacher/intake` shows `Required event fields`.
- Confirm the required event fields include `event_effect`, `taxonomy_version`, and `event_acceptance_gate_id`.
- Confirm new event types are classified as progress-affecting, report-only, or support-only before pilot release.
- Confirm support-only events cannot unlock progress, award Star Dust, update mastery, or replace target-language practice.
- Confirm `npm run verify:taxonomy` passes.

## Verification Command

```powershell
npm run verify:taxonomy
npm run verify:foundation
```
