# 2026-07-01: Teacher Persistence And Release Foundation

Status: connector-side implementation complete; local typecheck/build still required after pull.

## Scope

This build session strengthened the foundation before adding more game polish.

Implemented scaffold work:

- Teacher session settings contract.
- Teacher session lifecycle action contract.
- Teacher session monitor display for settings, safety status, warnings, lifecycle actions, and report state.
- Durable persistence record map for pilot planning.
- Teacher intake display for durable records, persistence warnings, and backend-neutral storage paths.
- Package release/versioning scaffold for year-on-year textbook, media, and game updates.

## Routes To Verify

- `http://127.0.0.1:3000/teacher/intake`
- `http://127.0.0.1:3000/teacher/sessions/demo-unit-1`
- `http://127.0.0.1:3000/teacher/sessions/partner-demo-unit-1`

## Verification Docs

- `docs/verification/CONTENT_INTAKE_CHECKS.md`
- `docs/verification/PERSISTENCE_BOUNDARY_CHECKS.md`
- `docs/verification/TEACHER_SESSION_MONITOR_CHECKS.md`

## Decisions And Contracts

- `docs/TEACHER_SESSION_SETTINGS_CONTRACT.md`
- `docs/PERSISTENCE_RECORD_CONTRACT.md`
- `docs/PACKAGE_RELEASE_VERSIONING_CONTRACT.md`
- `docs/adr/0026-teacher-session-settings-contract.md`
- `docs/adr/0027-package-release-versioning.md`
- `docs/decision-register/DR-027-teacher-session-settings-contract.md`
- `docs/decision-register/DR-028-package-release-versioning.md`

## Human Pull Commands

```powershell
cd "D:\LIVING TEXTBOOOK PROJECT\LivingTextbook"
git restore apps/web/next-env.d.ts
git pull --ff-only
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
npm run dev --workspace @living-textbook/web -- --hostname 127.0.0.1 --port 3000
```

## Notes

Connector readback was used for repository verification. Local browser verification is still needed because the managed session could not safely synchronize and typecheck the local checkout after connector-side commits.
