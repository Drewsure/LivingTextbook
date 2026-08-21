# Active Route Matrix Checks

Run after active route, game route, media route, printable route, teacher report, local companion, QR, or route verification changes.

```powershell
npm run verify:foundation
```

Then verify:

- `http://127.0.0.1:3000/teacher/intake` loads.
- The active route matrix shows `75 checked routes`.
- The matrix includes the sample publisher and MiniStar source review workspace routes.
- The matrix includes the teacher draft package preview route.
- The matrix includes the global teacher draft review queue and tenant-scoped sample publisher and MiniStar draft review queue routes.
- The matrix includes the teacher private library route.
- The matrix includes the teacher upload workspace route.
- The matrix includes the evidence packet review index route.
- The matrix includes the evidence packet handoff preview route.
- The matrix includes the Labelled Diagram asset workspace route.
- The matrix includes the media asset workspace route.
- The matrix includes the sample publisher local companion route.
- The matrix includes MiniStar and sample-publisher teacher unit review routes.
- The matrix includes MiniStar and sample-publisher private assignment link routes.
- The matrix includes MiniStar and sample-publisher collection room routes.
- The matrix includes MiniStar and sample-publisher curated activity hub routes.
- The matrix includes MiniStar and sample-publisher printable worksheet preview routes.
- The matrix includes MiniStar and sample-publisher report package preview routes.
- The matrix includes flashcards, Match Up, Label It, memory, Balloon Pop, quiz, True or False, Type Answer, Spelling Practice, sentence, speak, media, teacher session, and Training Academy routes for both tenant samples.
- `verify:game-modes` requires active Flashcards, Match Up, Label It, Memory Match, Balloon Pop, Quiz, True or False, Type Answer, Spelling Practice, Sentence Builder, and Speak It routes to have route contract ids, patterns, and helper functions.
- Activity hub routes must preserve curated reviewed pathways and must not become a switch-to-anything template panel.
- The matrix includes the active stable QR alias route.
