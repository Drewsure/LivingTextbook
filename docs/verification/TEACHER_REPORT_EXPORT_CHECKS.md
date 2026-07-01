# Teacher Report Export Verification

Scope: teacher session monitor export readiness scaffold.

Routes to verify after pulling and rebuilding:

- `http://127.0.0.1:3000/teacher/sessions/demo-unit-1`
- `http://127.0.0.1:3000/teacher/sessions/partner-demo-unit-1`

Checks:

1. The page includes a `Report export readiness` section.
2. Export readiness is not shown as production-ready in the scaffold.
3. The allowed formats include `csv-summary` and `json-event-stream`.
4. The included scopes show teacher summary, student progress, event stream, media engagement, Training Academy recovery, and speech-practice summary.
5. The excluded list clearly names raw learner audio and learner transcripts.
6. Export safety passes the shared contract.
7. Export blockers mention missing school/tenant policy and missing persistence.
8. The MiniStar and sample-publisher routes use the same shared export contract.
9. Typecheck passes with the shared `TeacherReportExportPlan` contract.
10. Production build passes through the package build script.

Expected local commands:

```powershell
cd "D:\LIVING TEXTBOOOK PROJECT\LivingTextbook"
git pull --ff-only
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
npm run dev --workspace @living-textbook/web -- --hostname 127.0.0.1 --port 3000
```

Acceptance rule: report export may be visible as a future teacher workflow, but it must remain policy-blocked and persistence-blocked until real student-data retention, access control, and export rules are accepted.
