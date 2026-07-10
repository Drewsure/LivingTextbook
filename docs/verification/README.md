# Living Textbook Verification Index

Use `docs/VERIFICATION_CHECKLIST.md` as the primary local verification path after the `legacy-source-import` branch is synced and the app is running. Use `docs/LOCAL_SYNC_AND_VERIFY_RUNBOOK.md` when the local Windows checkout needs to catch up to connector-side commits.

Focused verification supplements:

- `docs/verification/AI_TUTOR_ENTITLEMENT_CHECKS.md`
- `docs/verification/ACTIVE_ROUTE_MATRIX_PANEL_CHECKS.md`
- `docs/verification/MEDIA_PLAYLIST_ROUTE_CHECKS.md`
- `docs/verification/AUDIO_COVERED_MODE_READINESS_CHECKS.md`
- `docs/verification/AI_AUTHORING_VERIFIER_CHECKS.md`
- `docs/verification/BACKEND_DECISION_MATRIX_CHECKS.md`
- `docs/verification/BACKEND_MIGRATION_CANDIDATES_CHECKS.md`
- `docs/verification/BACKEND_MIGRATION_SPEC_CHECKS.md`
- `docs/verification/BACKEND_SELECTION_GATE_CHECKS.md`
- `docs/verification/BACKEND_SCHEMA_DRAFT_CHECKS.md`
- `docs/verification/BACKGROUND_MEDIA_POLICY_CHECKS.md`
- `docs/verification/BACKGROUND_MEDIA_SESSION_SAFETY_CHECKS.md`
- `docs/verification/CLASS_ROSTER_READINESS_CHECKS.md`
- `docs/verification/CONTENT_INTAKE_CHECKS.md`
- `docs/verification/DEPLOYMENT_PROFILE_CHECKS.md`
- `docs/verification/EDITION_QR_ALIAS_CHECKS.md`
- `docs/verification/GAME_PROTOTYPE_ASSIGNMENT_CHECKS.md`
- `docs/verification/GAME_MODE_AUDIO_COVERAGE_CHECKS.md`
- `docs/verification/LOCAL_DEPLOYMENT_PREFLIGHT_CHECKS.md`
- `docs/verification/MEDIA_TELEMETRY_CHECKS.md`
- `docs/verification/MEDIA_RIGHTS_READINESS_CHECKS.md`
- `docs/verification/MEDIA_SUPPORT_ONLY_EVENT_CHECKS.md`
- `docs/verification/PACKAGE_APPROVAL_LEDGER_CHECKS.md`
- `docs/verification/PACKAGE_PUBLISH_GATE_CHECKS.md`
- `docs/verification/PARTNER_DEMO_ACTIVE_ROUTE_CHECKS.md`
- `docs/verification/PERSISTENCE_ADAPTER_CHECKS.md`
- `docs/verification/PERSISTENCE_BOUNDARY_CHECKS.md`
- `docs/verification/PILOT_HANDOFF_PACKAGE_CHECKS.md`
- `docs/verification/PILOT_POLICY_CHECKS.md`
- `docs/verification/PILOT_SOURCE_STRATEGY_CHECKS.md`
- `docs/verification/PROGRESS_EVENT_TAXONOMY_CHECKS.md`
- `docs/verification/PILOT_READINESS_GATE_CHECKS.md`
- `docs/verification/PUBLISHER_MAINTENANCE_CHECKS.md`
- `docs/verification/PWA_INSTALLABILITY_CHECKS.md`
- `docs/verification/QR_PRINT_READINESS_CHECKS.md`
- `docs/verification/RECOMMENDED_GAME_PATH_CHECKS.md`
- `docs/verification/QUIZ_REPORTING_CHECKS.md`
- `docs/verification/QUIZ_SELECTION_PLAYABLE_CHECKS.md`
- `docs/verification/SECOND_TENANT_PACKAGE_CHECKS.md`
- `docs/verification/SELECTION_ENGINE_PREVIEW_CHECKS.md`
- `docs/verification/SENTENCE_BUILDER_PLAYABLE_CHECKS.md`
- `docs/verification/SENTENCE_BUILDER_DISCOVERY_CHECKS.md`
- `docs/verification/SENTENCE_BUILDER_REPORTING_CHECKS.md`
- `docs/verification/SPEAK_IT_CORE_CHECKS.md`
- `docs/verification/SOURCE_REVIEW_QUEUE_CHECKS.md`
- `docs/verification/TEACHER_ASSIGNMENT_READINESS_CHECKS.md`
- `docs/verification/TEACHER_ASSIGNMENT_GAME_PATH_CHECKS.md`
- `docs/verification/TEACHER_ASSIGNMENT_ROLLOUT_CHECKS.md`
- `docs/verification/TEACHER_DEMO_ROUTE_SHORTCUT_CHECKS.md`
- `docs/verification/TEACHER_MICROPHONE_APPROVAL_CHECKS.md`
- `docs/verification/TEACHER_REPORT_EXPORT_CHECKS.md`
- `docs/verification/TEACHER_SESSION_PREFLIGHT_CHECKS.md`
- `docs/verification/TEACHER_SESSION_ASSIGNED_GAME_PATH_CHECKS.md`
- `docs/verification/TEACHER_SESSION_MONITOR_CHECKS.md`
- `docs/verification/TEXT_SPELLING_ENGINE_CHECKS.md`
- `docs/verification/UNIT_GAME_OFFER_MAP_CHECKS.md`
- `docs/verification/UNIT_PACKAGE_READINESS_CHECKS.md`
- `docs/verification/VOICE_TUTOR_PACKAGE_CHECKS.md`

## Current Hard Gate

Connector-side changes are not locally verified until the local checkout has pulled the latest `legacy-source-import` commits, typecheck/build pass, and the browser routes have been reviewed.

Normal local verification flow:

```powershell
cd "D:\LIVING TEXTBOOOK PROJECT\LivingTextbook"
git fetch origin legacy-source-import
git pull --ff-only
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
npm run dev --workspace @living-textbook/web -- --hostname 127.0.0.1 --port 3000
```

If `apps/web/next-env.d.ts` blocks the pull, restore the generated file and pull again:

```powershell
git restore apps/web/next-env.d.ts
git fetch origin legacy-source-import
git pull --ff-only
```

Then verify:

- `/`
- `/teacher`
- `/teacher/intake`
- `/teacher/sessions/demo-unit-1`
- `/teacher/sessions/partner-demo-unit-1`
- `/launch/demo-unit-1`
- `/quiz/demo-unit-1`
- `/sentence/demo-unit-1`
- `/enter/ministar`
- `/speak/demo-unit-1`
- `/training/demo-unit-1`
- `/partner-demo`
- `/enter/sample-publisher`
- `/launch/partner-demo-unit-1`
- `/quiz/partner-demo-unit-1`
- `/sentence/partner-demo-unit-1`
- `/speak/partner-demo-unit-1`
- `/q/tenant/sample-publisher/series/starter-english/book/level-1/unit/unit-1/activity/hello-friends/language/en/edition/2026/version/1.0.0`
- `/manifest.webmanifest`
- `/icons/living-textbook-icon.svg`

Do not mark connector-side changes as locally verified until this is complete.
