# Teacher Assignment Game Path Checks

Run after syncing `legacy-source-import`.

```powershell
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
```

Then verify:

- `http://127.0.0.1:3000/teacher/intake` loads.
- Teacher assignment readiness shows an assigned game path for each sample plan.
- The Level 1 assigned game path includes Flashcards, Match Up, Label It, Memory Match, Balloon Pop, Quiz, True or False, Type Answer, Spelling Practice, Fill in the Blank, and Speak It.
- Sentence Builder is excluded from the Level 1 assigned path and remains planned for Level 2+.
- The assigned game path shows audio coverage per assigned mode.
- Assignment warnings still appear for persistence, policy, QR, and premium blockers.
- The page does not claim saved teacher customization yet.
