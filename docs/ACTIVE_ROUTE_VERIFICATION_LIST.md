# Active Route Verification List

Document type: QA operating note  
Status: active scaffold  
Last updated: 2026-07-16

## Purpose

This list names the routes that should be checked after foundation changes. It is a working QA map for the current `legacy-source-import` build, not a public sitemap.

## Core Routes

- `http://127.0.0.1:3000/`
- `http://127.0.0.1:3000/teacher`
- `http://127.0.0.1:3000/teacher/intake`
- `http://127.0.0.1:3000/teacher/sources/sample-publisher`
- `http://127.0.0.1:3000/teacher/generator/sample-publisher`
- `http://127.0.0.1:3000/teacher/dry-run/sample-publisher-first-handoff-teacher-dry-run`
- `http://127.0.0.1:3000/teacher/launch-gate/starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate`
- `http://127.0.0.1:3000/teacher/policy-handoff/starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate-school-policy-gate-handoff-packet`
- `http://127.0.0.1:3000/teacher/authoring/draft-sample-publisher-l1-u1`
- `http://127.0.0.1:3000/teacher/review`
- `http://127.0.0.1:3000/teacher/library/sample-publisher`
- `http://127.0.0.1:3000/teacher/uploads/sample-publisher`
- `http://127.0.0.1:3000/teacher/evidence/sample-publisher`
- `http://127.0.0.1:3000/teacher/evidence/sample-publisher/handoff`
- `http://127.0.0.1:3000/teacher/assets/labelled-diagram/sample-publisher-l1-u1-labelled-diagram`
- `http://127.0.0.1:3000/teacher/assets/media/sample-publisher-l1-u1-routines-media`
- `http://127.0.0.1:3000/teacher/media/sample-publisher`
- `http://127.0.0.1:3000/partner-demo`
- `http://127.0.0.1:3000/local/sample-publisher`
- `http://127.0.0.1:3000/manifest.webmanifest`

## MiniStar Reference Routes

- `http://127.0.0.1:3000/enter/ministar`
- `http://127.0.0.1:3000/teacher/sources/ministar`
- `http://127.0.0.1:3000/teacher/generator/ministar`
- `http://127.0.0.1:3000/launch/demo-unit-1`
- `http://127.0.0.1:3000/teacher/units/ministar%3Aministar-english%3AL1%3AU1`
- `http://127.0.0.1:3000/assign/assignment-ministar-demo-whole-class`
- `http://127.0.0.1:3000/collection/demo-unit-1`
- `http://127.0.0.1:3000/training/demo-unit-1`
- `http://127.0.0.1:3000/training/demo-unit-1?focus=sentence-review`
- `http://127.0.0.1:3000/quiz/demo-unit-1`
- `http://127.0.0.1:3000/sentence/demo-unit-1`
- `http://127.0.0.1:3000/speak/demo-unit-1`
- `http://127.0.0.1:3000/media/playlist-ministar-l1-u1-greetings`
- `http://127.0.0.1:3000/print/demo-unit-1`
- `http://127.0.0.1:3000/teacher/sessions/demo-unit-1`
- `http://127.0.0.1:3000/teacher/sessions/demo-unit-1/report-package`

## Sample Publisher White-Label Routes

- `http://127.0.0.1:3000/enter/sample-publisher`
- `http://127.0.0.1:3000/launch/partner-demo-unit-1`
- `http://127.0.0.1:3000/teacher/units/sample-publisher%3Apartner-textbook-companion%3AL1%3AU1`
- `http://127.0.0.1:3000/assign/assignment-sample-publisher-front-door`
- `http://127.0.0.1:3000/collection/partner-demo-unit-1`
- `http://127.0.0.1:3000/training/partner-demo-unit-1`
- `http://127.0.0.1:3000/training/partner-demo-unit-1?focus=sentence-review`
- `http://127.0.0.1:3000/quiz/partner-demo-unit-1`
- `http://127.0.0.1:3000/sentence/partner-demo-unit-1`
- `http://127.0.0.1:3000/speak/partner-demo-unit-1`
- `http://127.0.0.1:3000/media/playlist-sample-publisher-l1-u1-routines`
- `http://127.0.0.1:3000/print/partner-demo-unit-1`
- `http://127.0.0.1:3000/teacher/sessions/partner-demo-unit-1`
- `http://127.0.0.1:3000/teacher/sessions/partner-demo-unit-1/report-package`

## Stable QR Alias Route

- `http://127.0.0.1:3000/q/tenant/sample-publisher/series/starter-english/book/level-1/unit/unit-1/activity/hello-friends/language/en/edition/2026/version/1.0.0`

## Planned QR Route, Not Active Yet

This route appears in the closed local companion assignment plan, but currently returns 404 because its alias is not in the sample QR registry and `stableQrReady` is still false:

- `http://127.0.0.1:3000/q/tenant/sample-publisher/series/sample-partner-series/book/starter-book/unit/unit-1/activity/daily-routines-entry`

## Current Verification Rule

After any route, package, assignment, game, audio, QR, or teacher-report change:

1. Run typecheck and production build.
2. Confirm `/teacher/intake` loads.
3. Confirm one MiniStar student route loads.
4. Confirm one sample publisher student route loads.
5. Confirm one teacher session route loads.
6. Confirm the active stable QR alias route loads.

Do not treat a passing route as pilot-publishable unless package publish gates, teacher assignment readiness, rollout gates, and session preflight checks are also acceptable.
