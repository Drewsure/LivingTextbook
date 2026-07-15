# Active Route Matrix Checks

Run after active route, game route, media route, printable route, teacher report, local companion, QR, or route verification changes.

```powershell
npm run verify:foundation
```

Then verify:

- `http://127.0.0.1:3000/teacher/intake` loads.
- The active route matrix shows `42 checked routes`.
- The matrix includes the teacher draft package preview route.
- The matrix includes the teacher private library route.
- The matrix includes the teacher upload workspace route.
- The matrix includes the sample publisher local companion route.
- The matrix includes MiniStar and sample-publisher teacher unit review routes.
- The matrix includes MiniStar and sample-publisher private assignment link routes.
- The matrix includes MiniStar and sample-publisher collection room routes.
- The matrix includes MiniStar and sample-publisher printable worksheet preview routes.
- The matrix includes MiniStar and sample-publisher report package preview routes.
- The matrix includes quiz, sentence, speak, media, teacher session, and Training Academy routes for both tenant samples.
- The matrix includes the active stable QR alias route.
