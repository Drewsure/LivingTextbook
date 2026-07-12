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
- The page shows `taxonomy-v2026.07.foundation`.
- The page shows `Required event fields`.
- `route_guidance_listened` is marked support-only.
- Support-only events do not mention Star Dust, mastery, or unlock effects.
- Progress-affecting events include entry practice, game unlock, answer result, mastery update, and game completion.
- Teacher-visible reporting is preserved without implying production persistence is complete.
- `media_playlist_opened` is present as report-only and does not unlock progress, award Star Dust, or count as media completion.
