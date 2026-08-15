# Local Companion Game Route Checks

Run after local companion, game route, game audio, report event, or local bundle changes.

```powershell
npm run verify:foundation
```

Then verify:

- `http://127.0.0.1:3000/local/sample-publisher` loads.
- The page shows `Bundled game routes`.
- The sample publisher local package lists flashcards, Match Up, Label It, Memory Match, Quiz, True or False, Type Answer, Sentence Builder, and Speak It.
- Game cards show engine id, local path, audio coverage, and report-event support.
- The generated manifest snapshot includes game route metadata.
