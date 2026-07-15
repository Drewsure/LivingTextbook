# Teacher Unit Review Route Checks

Run after teacher unit review, package readiness, assignment controls, route contracts, audio coverage, media, or pilot blocker copy changes.

```powershell
npm run verify:foundation
```

Open:

- `http://127.0.0.1:3000/teacher/units/ministar%3Aministar-english%3AL1%3AU1`
- `http://127.0.0.1:3000/teacher/units/sample-publisher%3Apartner-textbook-companion%3AL1%3AU1`

Expected result:

- The page shows `Teacher unit review`.
- The page says `Review before assignment`.
- The page shows `Launch safety`.
- The page says `Assignment stays review-only`.
- The page shows `No live classroom launch`, `No production student accounts`, `Real learner data blocked`, and `Report export still blocked`.
- The page shows `Audio and media coverage`.
- The page shows a `Curated activity path`.
- Activity cards mark which game modes have audio coverage.
- Route readiness links include student launch, media, printable, quiz, sentence, speak, Training Academy, teacher monitor, and report package routes where available.
- The page shows `Pilot blockers` rather than implying the package is ready for real classroom assignment.

Regression guard:

This route is a review scaffold. It must not become a live editor, production publish button, or persistent assignment settings screen until the package publish gate, approval ledger, teacher assignment readiness, session settings, roster boundary, and storage gates are all accepted.
