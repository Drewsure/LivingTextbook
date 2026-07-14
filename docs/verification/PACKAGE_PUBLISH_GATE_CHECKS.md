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
- the page fails typecheck/build after sync.
