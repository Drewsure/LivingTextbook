# Backend Schema Draft Verification

Use after pulling the latest `legacy-source-import` branch and running local typecheck/build.

## Route

- `http://127.0.0.1:3000/teacher/intake`

## Checks

1. The teacher intake page renders a `Backend schema draft` panel after the backend decision matrix.
2. The panel states that it is vendor-neutral and not a migration file.
3. The schema decision rule is visible.
4. The panel lists Tenant, Package release, Package game/audio coverage, Route alias, Media manifest, Launch session, Progress event, Package publish gate, and Package approval ledger entities.
5. Each entity shows fields, relationships, indexes, forbidden fields, and migration note.
6. Tenant records include brand tokens and feature entitlements.
7. Package release records include edition/version and review status.
8. Package game/audio coverage records include assigned game modes, audio-covered game modes, audio gap count, and forbid raw audio, learner recordings, transcripts, and unreviewed cue output.
9. Route alias records prohibit localhost and direct media-file QR targets.
10. Media manifest records include rights status and local/hosted delivery paths.
11. Launch session records include settings for audio, assist language, microphone, AI Tutor, background media, retention, and report export.
12. Progress event records include `event_effect`, `taxonomy_version`, and `event_acceptance_gate_id`.
13. Progress event records forbid raw learner audio and transcripts.
14. Progress event rules block support-only events from mastery/scoring interpretation.
15. Package publish gate records forbid pilot-publishable status while blockers are open.
16. Package approval ledger records do not imply fake signed approvals.
17. Cross-cutting rules preserve tenant boundaries, audio/transcript exclusions, media manifest separation, package game/audio coverage as metadata only, progress event effect taxonomy, event acceptance gate requirements, support-language limits, AI Tutor gating, and hosted/local vocabulary compatibility.
18. The panel uses existing tenant styling and does not introduce premium polish.

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

- the panel chooses a backend vendor,
- the schema stores raw learner audio or transcripts,
- package release control is omitted,
- tenant boundaries are absent,
- local/hosted compatibility is not visible,
- typecheck/build fails after sync.
