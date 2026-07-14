# Package Publish Gate Verification

Use after pulling the latest `legacy-source-import` branch and running local typecheck/build.

## Route

- `http://127.0.0.1:3000/teacher/intake`

## Checks

1. The teacher intake page renders a `Package publish gate` panel after the pilot handoff package.
2. The panel shows the release candidate label and target pilot route.
3. The top status says the package should not be published while release-blocking gates remain open.
4. Ready, needs-review, and blocked counts match the sample gate data.
5. Content, media, games, QR, reports, policy, deployment, and persistence gates are visible.
6. Each gate shows owner, status, evidence, next step, required-before-pilot items, and not-allowed-yet items.
7. Media rights are not treated as complete while real audio/video assets are placeholders.
8. Game audio coverage is visible as a release-blocking gate and requires assigned game modes to have reviewed audio coverage or an approved fallback.
9. Activity compatibility and rendering profiles are visible as a release-blocking gate.
10. The gate requires reviewed `activity_compatibility_snapshot`, `template_rendering_profile`, and `font_accessibility_profile` records before pathway changes, rendered variants, printables, tenant font packs, or extra conversions become student-facing.
11. Teacher reports and persistence remain blocked until real policy and backend decisions are accepted.
12. Media rights gates require reviewed playlist routes, local/hosted bundle decisions, and support-only media engagement reporting.
13. Media-only completion is not allowed to unlock games, award mastery, or substitute for target-language practice.
14. The gate keeps support language as support only; it does not unlock target-language progression.
15. The gate keeps optional AI Tutor and speech scoring tenant-gated and cost-visible.
16. The panel uses the existing app shell, tenant styling variables, card rhythm, and status-pill primitives.
17. No premium polish or mascot-specific visuals are introduced by this gate.
18. The teacher intake page renders a `Publisher pilot readiness summary` derived from the package publish gate.
19. The summary clearly separates `Demo-ready now`, `Pilot blockers`, `Missing evidence`, and `Still not allowed`.
20. The summary displays `Source of truth: package publish gate` and `No publish action`.
21. The summary does not duplicate or replace release-control data with a second hand-maintained source of truth.
22. The teacher intake page renders a `Pilot evidence packet preview` derived from the package publish gate and package approval ledger.
23. The evidence packet shows `Gate evidence needed`, `Approval evidence needed`, `No evidence upload`, and `No signed approval capture`.
24. The evidence packet states that package evidence stays metadata first and cannot approve a pilot by itself.
25. The teacher intake page renders a `Pilot launch checklist preview` derived from readiness, evidence, and handoff data.
26. The checklist shows `No classroom launch action`, `Go/no-go blocked`, `Required before classroom pilot`, `Teacher classroom dry run`, and `Controlled partner demo`.
27. The checklist does not launch students, capture approvals, upload evidence, or mark the package pilot-ready.
28. The teacher intake page renders a `Teacher dry-run rehearsal preview` derived from the pilot launch checklist, evidence packet, and handoff package.
29. The rehearsal shows `No student launch action`, `Teacher-only rehearsal`, `Dry-run evidence only`, and `Do not collect real learner data`.
30. The rehearsal includes `Entry and route rehearsal`, `Game and audio rehearsal`, `Media and support-language rehearsal`, and `Report and policy rehearsal`.
31. The rehearsal does not create assignments, store live learner progress, export reports, upload evidence, or approve a classroom pilot.
32. The teacher intake page renders a `Classroom launch gate preview` derived from the publish gate, approval ledger, evidence packet, and teacher dry run.
33. The classroom launch gate shows `Launch blocked`, `No live student session`, `No launch button`, `Dry-run evidence required`, and `Policy and persistence required`.
34. The classroom launch gate keeps `Real learner data blocked` and `Report export still blocked` visible before any future launch workflow.
35. The classroom launch gate appears on the focused teacher dry-run route as the final boundary after rehearsal.

## Build Verification

Run:

```powershell
Set-Location -LiteralPath "D:\LIVING TEXTBOOOK PROJECT\LivingTextbook"
git restore apps/web/next-env.d.ts
git pull --ff-only
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
npm run dev --workspace @living-textbook/web -- --hostname 127.0.0.1 --port 3000
```

Then open:

- `http://127.0.0.1:3000/teacher/intake`

## Failure Conditions

Do not mark this verified if:

- the gate implies a demo package is ready for live student data,
- a release-blocking item is hidden in secondary documentation only,
- media rights, game audio coverage, activity compatibility/profile readiness, QR stability, persistence, reports, or policy are omitted,
- the panel creates tenant-specific hard-coding,
- the teacher dry-run rehearsal can be mistaken for a live student launch,
- the classroom launch gate hides the launch-blocked, no-live-student-session, or no-launch-button boundary,
- the page fails typecheck/build after sync.
