# Progress Event Taxonomy Checks

Run after syncing `legacy-source-import`.

```powershell
npm run verify:taxonomy
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
```

Then verify:

- `http://127.0.0.1:3000/teacher/intake` loads.
- The page includes a `Progress event taxonomy` section.
- The page shows `Event taxonomy guard active`.
- The page shows `Event taxonomy guard blocks`.
- The page shows `Event taxonomy guard warnings`.
- The page shows `taxonomy-v2026.07.foundation`.
- The page shows `Required event fields`.
- `packages/content-model/src/progressEventTaxonomy.ts` exports `validateProgressEventTaxonomyRegistry`.
- `packages/content-model/src/progressEventTaxonomy.ts` exports `createProgressEventEnvelope`, `validateProgressEventEnvelope`, and `validateProgressEventEnvelopeStream`.
- `npm run verify:taxonomy` confirms the sample taxonomy uses the shared guard.
- `/teacher/sessions/demo-unit-1` and `/teacher/sessions/partner-demo-unit-1` show `Progress event envelope gate`.
- The session routes show `Envelope guard active`, `Standard event contract`, `event_acceptance_gate_id`, and `taxonomy_version`.
- `route_guidance_listened` is marked support-only.
- Support-only events do not mention Star Dust, mastery, or unlock effects.
- Progress-affecting events include entry practice, game unlock, answer result, mastery update, and game completion.
- Teacher-visible reporting is preserved without implying production persistence is complete.
- `media_playlist_opened` is present as report-only and does not unlock progress, award Star Dust, or count as media completion.
