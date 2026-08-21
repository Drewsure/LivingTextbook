# Progress Event Taxonomy Coverage Verifier Checks

## Scope

Run after content-model event types, game events, media events, speaking events, AI Tutor events, reward events, route-guidance events, taxonomy data, or verification scripts change.

## Checks

- Confirm `npm run verify:taxonomy` passes.
- Confirm every shared `GameEventType` appears in `sampleProgressEventTaxonomy`.
- Confirm taxonomy events do not exist outside `GameEventType`.
- Confirm duplicate taxonomy event entries fail verification.
- Confirm required storage fields include `event_effect`, `taxonomy_version`, `event_acceptance_gate_id`, and `settings_context`.
- Confirm `settings_context` blocks support-language progress, media-only progress, and scoring profile overrides.
- Confirm `npm run verify:foundation` includes taxonomy verification.

## Verification Command

```powershell
npm run verify:foundation
```
