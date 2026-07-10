# Pilot Source Strategy Checks

Run after pilot/source intake changes.

```powershell
npm run verify:foundation
```

Then verify:

- `http://127.0.0.1:3000/teacher/intake` loads.
- The page shows `Pilot source strategy`.
- Manually reviewed units are marked recommended.
- Draft PDF import is marked as a later reviewed workflow.
- Automatic PDF-to-student publishing is blocked.
- The panel does not imply parser, OCR, or AI draft output can become student-facing without human review.

