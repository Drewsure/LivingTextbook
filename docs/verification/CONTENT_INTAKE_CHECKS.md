# Content Intake Checks

Use these checks after pulling the latest `legacy-source-import` branch and running the local dev server.

## Commands

```powershell
cd "D:\LIVING TEXTBOOOK PROJECT\LivingTextbook"
git restore apps/web/next-env.d.ts
git pull --ff-only
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
npm run dev --workspace @living-textbook/web -- --hostname 127.0.0.1 --port 3000
```

## Routes

- `http://127.0.0.1:3000/teacher/intake`
- `http://127.0.0.1:3000/enter/ministar`
- `http://127.0.0.1:3000/enter/sample-publisher`

## Expected Results

- `/teacher/intake` shows the content intake and route registry page.
- The intake panel lists both the MiniStar DOCX sample and the Sample Publisher PDF sample.
- The intake gates distinguish completed review items from media-rights and teacher-approval items that remain pending.
- The route registry panel lists `/enter/ministar` and `/enter/sample-publisher`.
- The route registry keeps permanent QR paths separate from front-door paths.
- The teacher/admin page does not claim automated PDF extraction is production-ready.
- The student front-door routes still require target-language practice after entry.

## Failure Signals

- Raw PDF/DOCX intake is treated as automatically student-ready.
- Missing media files are hidden instead of represented as pending rights/file handoff.
- Route data is hard-coded only inside route components.
- The intake route introduces production auth claims or database persistence that do not exist yet.
