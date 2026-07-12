# Game Mode Audio Coverage Checks

Run after syncing `legacy-source-import`.

```powershell
npm run verify:game-modes
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
```

Then verify:

- The shared game mode catalog coverage verifier passes.
- `http://127.0.0.1:3000/` shows package audio support without validation errors.
- `http://127.0.0.1:3000/partner-demo` shows partner package audio support without validation errors.
- MiniStar audio support plan includes Flashcards, Memory Match, Quiz, Sentence Builder, and Speak It.
- Sample publisher audio support plan includes Flashcards, Memory Match, Quiz, Sentence Builder, and Speak It.
- The cues remain text-to-speech placeholders unless reviewed production media is supplied.
