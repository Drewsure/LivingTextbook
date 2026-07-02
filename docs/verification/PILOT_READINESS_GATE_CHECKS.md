# Pilot Readiness Gate Verification

Use this checklist after pulling `legacy-source-import` and running local typecheck/build.

## Route

Open:

- `http://127.0.0.1:3000/teacher/intake`

## Checks

- The teacher intake page shows a `Pilot readiness gate` panel near the top of the page.
- The panel distinguishes a static demo from a real partner pilot.
- The recommended first path is a hosted PWA pilot or hosted pilot adapter, not a local installer by default.
- The gate shows open policy blockers for student progress retention, teacher report export, media rights, and local deployment policy when they are not accepted.
- The gate shows open durable-write blockers for route registry, launch-session settings, progress events, or local bundle writes until persistence is implemented.
- The panel states that core pilot operation does not require AI Tutor, raw learner audio storage, or transcript storage.
- The panel preserves local/closed deployment as a later first-class path, not as a discarded option.
- The detailed policy and persistence panels still appear below the summary gate.

## Acceptance

A school, publisher, or internal reviewer should be able to answer these questions from the page:

- What can be shown as a demo now?
- What blocks a real classroom pilot?
- Which path is cheapest and fastest for the first pilot?
- What remains required for closed/local textbook companion deployment?
