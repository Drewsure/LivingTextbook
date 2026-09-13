# Recommended Game Path Checks

Run after syncing `legacy-source-import`.

```powershell
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
```

Then verify:

- `http://127.0.0.1:3000/launch/demo-unit-1` loads.
- Before flashcard completion, the recommended game path is locked.
- After completing flashcards, the Level 1 reviewed path shows Match Up, Label It, Memory Match, Balloon Pop, Quiz, True or False, Type Answer, Spelling Practice, and Fill in the Blank as ready; Speak It remains teacher-controlled.
- Sentence Builder is not presented as a ready Level 1 route and remains planned for Level 2+.
- Memory Match starts inside the launch page.
- Quiz links to `/quiz/demo-unit-1`.
- Sentence Builder links to `/sentence/demo-unit-1`.
- Speak It links to `/speak/demo-unit-1`.
- Each recommended route has a separate `Listen` control and `Open` link; listening to a route summary must not navigate or unlock progress by itself.
- Tapping a route `Listen` control records `route_guidance_listened` with `progressionUnlockAllowed: false`.
- `http://127.0.0.1:3000/enter/ministar` shows the same behavior after opening the unit.
- Support-language text alone does not unlock the recommended path.
- Student progress summary shows English listened progress and keeps support unlocks at zero.
- Student progress summary shows route listens separately from English listened progress.
