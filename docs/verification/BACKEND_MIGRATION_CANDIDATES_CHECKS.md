# Backend Migration Candidates Verification

Use after pulling the latest `legacy-source-import` branch and running local typecheck/build.

## Route

- `http://127.0.0.1:3000/teacher/intake`

## Checks

1. The teacher intake page renders a `Backend migration candidates` panel after the backend schema draft.
2. The panel states it is vendor-neutral and not production migration work.
3. The sequencing rule is visible.
4. The panel lists migration candidates for tenant records, package release/content, teacher draft review handoff packets, AI generated package manifests, route aliases, media manifests, release candidates/publish gates/approval ledgers, launch sessions, progress events, and local export/restore.
5. Each candidate shows target entities, prerequisites, implementation notes, rollback/export needs, and not-allowed-yet items.
6. Tenant migration forbids tenant-specific schema forks and global hard-coded support language.
7. Package release migration forbids raw PDF or AI extraction becoming active student payload automatically.
8. Teacher draft review handoff migration preserves schema, source lineage, audio, rights/version, route/activity, and approval packet sections while blocking live review submission.
9. AI generated package manifest migration preserves prompt, draft JSON, audio, engine, gamification, verifier, review queue, media-rights, and release-lock lineage while blocking package assembly, routes, playlists, assignments, local bundles, and student-ready markers.
10. Route alias migration forbids localhost QR targets and direct media-file QR targets.
11. Media migration blocks anonymous ownership and unversioned replacement.
12. Release candidate/publish gate/approval ledger migration requires derived candidate status, approver identity, evidence storage, and rollback rules before real signatures.
13. Launch-session migration keeps support language from satisfying mastery or unlocks.
14. Progress-event migration preserves event effect taxonomy.
15. Progress-event migration forbids raw learner audio, transcripts, open-ended personal notes, ungated exports, and support-only events used for mastery or unlocks.
16. Local classroom migration is deferred and requires backup/restore, installer/update, and local bundle integrity before production.
17. Standing rules forbid production migrations before backend choice and policy gates are accepted.
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

- a backend vendor is chosen by the panel,
- production migrations are implied as already approved,
- student progress storage appears before policy acceptance,
- release-control migrations are omitted,
- release candidate status is omitted from release-control migrations,
- rollback/export requirements are missing,
- typecheck/build fails after sync.
