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
36. The teacher intake page renders a `School launch policy gate preview` derived from policy readiness, the classroom launch gate, and teacher dry-run rehearsal.
37. The focused classroom launch gate route renders the same school launch policy gate.
38. The school launch policy gate shows `School launch decision blocked`, `School privacy and retention acceptance`, `Classroom operating mode acceptance`, `Publisher media and local package acceptance`, `Teacher dry-run evidence acceptance`, and `Platform release and storage acceptance`.
39. The school launch policy gate shows `No school policy acceptance`, `No approval workflow`, `No real learner data collection`, `No teacher report export`, and `No support-language-only progression`.
40. The school launch policy gate remains a review packet only and does not imply a live launch, policy acceptance workflow, release mutation, or report export.
41. The teacher intake page renders a `School policy handoff packet preview` derived from the school launch policy gate.
42. The focused classroom launch gate route renders the same school policy handoff packet.
43. The handoff packet shows `Handoff draft only`, `No policy acceptance`, `Evidence needed`, `Deferred decisions`, and `Blocked actions`.
44. The handoff packet includes `Privacy, retention, and learner data`, `Teacher-led QR and student progression rules`, `Publisher media, music, video, and local package`, `Teacher dry-run and evidence packet`, and `Platform storage, release, and rollback controls`.
45. The handoff packet blocks `No support-language-only progression`, `No AI Tutor activation`, `No launch-ready status`, evidence export, signed approval capture, local activation, production QR promises, and live classroom workflow.
46. The focused school policy handoff route renders the same handoff packet and launch policy gate as a meeting packet preview.
47. The focused route shows `School policy handoff route workspace`, `School meeting packet preview`, `Discussion only`, `Handoff source routes`, `Teacher intake source`, `Classroom launch gate source`, `Teacher dry-run source`, and `Evidence handoff source`.
48. The teacher intake page renders a `School policy acceptance preflight` derived from the school policy handoff packet and reviewer identity/signature gate.
49. The focused classroom launch gate route and focused school policy handoff route render the same acceptance preflight.
50. The preflight shows `Acceptance blocked`, `Authenticated school approver`, `Policy text and scope`, `Evidence packet and attachment readiness`, `Release-control binding`, `Child safety and progression boundaries`, `Minimum acceptance record`, and `No accept button`.
51. The preflight blocks support-language-only progression, AI Tutor activation, microphone/scoring opt-ins without policy, evidence export, signed approval capture, storage activation, release-state mutation, production QR promises, and live classroom workflow.
52. The preflight can be used for school discussion and implementation planning, but it cannot be mistaken for a policy acceptance workflow, signature capture workflow, evidence export workflow, storage setup workflow, launch-ready marker, or student launch workflow.
53. The teacher intake page renders a `School policy text version pack` derived from the school policy acceptance preflight.
54. The focused classroom launch gate route and focused school policy handoff route render the same text version pack.
55. The text version pack shows `Policy text blocked`, `Versioned policy text only`, `Microphone and AI Tutor optional features`, and `No policy acceptance from text pack`.
56. The text version pack names privacy/retention/learner data, teacher-led QR and progression rules, publisher media/local package responsibilities, optional premium feature terms, storage/rollback terms, and evidence/signature/revocation terms.

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
- the school launch policy gate blurs controlled demo readiness with school-approved launch readiness,
- the school launch policy gate hides school, publisher, platform, or shared teacher dry-run ownership,
- the school policy handoff packet can be mistaken for policy acceptance, launch readiness, signed approval, evidence export, local activation, or production QR commitment,
- the focused school policy handoff route accepts policy, captures signatures, exports evidence, creates assignments, creates production QR promises, mutates release state, or launches students,
- the school policy acceptance preflight exposes an accept button, captures approval, captures signatures, exports evidence, activates storage, marks launch-ready status, activates AI Tutor, permits support-language-only progression, creates production QR promises, mutates release state, or starts a classroom workflow,
- the school policy text version pack can be mistaken for accepted terms, captures signatures, exports evidence, activates storage, marks launch-ready status, activates AI Tutor, creates production QR promises, mutates release state, or starts a classroom workflow,
- the page fails typecheck/build after sync.
