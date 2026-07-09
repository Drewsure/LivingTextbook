# Backend Migration Candidates Verification

Use after pulling the latest `legacy-source-import` branch and running local typecheck/build.

## Route

- `http://127.0.0.1:3000/teacher/intake`

## Checks

1. The teacher intake page renders a `Backend migration candidates` panel after the backend schema draft.
2. The panel states it is vendor-neutral and not production migration work.
3. The sequencing rule is visible.
4. The panel lists migration candidates for tenant records, package release/content, route aliases, media manifests, publish gates/approval ledgers, launch sessions, progress events, and local export/restore.
5. Each candidate shows target entities, prerequisites, implementation notes, rollback/export needs, and not-allowed-yet items.
6. Tenant migration forbids tenant-specific schema forks and global hard-coded support language.
7. Package release migration forbids raw PDF or AI extraction becoming active student payload automatically.
8. Route alias migration forbids localhost QR targets and direct media-file QR targets.
9. Media migration blocks anonymous ownership and unversioned replacement.
10. Publish gate/approval ledger migration requires approver identity, evidence storage, and rollback rules before real signatures.
11. Launch-session migration keeps support language from satisfying mastery or unlocks.
12. Progress-event migration forbids raw learner audio, transcripts, open-ended personal notes, and ungated exports.
13. Local classroom migration is deferred and requires backup/restore, installer/update, and local bundle integrity before production.
14. Standing rules forbid production migrations before backend choice and policy gates are accepted.
15. The panel uses existing tenant styling and does not introduce premium polish.

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
- rollback/export requirements are missing,
- typecheck/build fails after sync.
