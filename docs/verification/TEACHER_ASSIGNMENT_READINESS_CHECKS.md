# Teacher Assignment Readiness Verification

Use this checklist after pulling `legacy-source-import` and running local typecheck/build.

## Routes

Open:

- `http://127.0.0.1:3000/teacher/intake`
- `http://127.0.0.1:3000/launch/demo-unit-1`
- `http://127.0.0.1:3000/speak/demo-unit-1`
- `http://127.0.0.1:3000/launch/partner-demo-unit-1`
- `http://127.0.0.1:3000/speak/partner-demo-unit-1`

## Teacher/Admin Checks

- The intake page shows a `Teacher assignment readiness` panel below the unit package readiness panel.
- The panel lists assignment plans for MiniStar, the sample publisher front-door pilot draft, and the closed textbook companion draft.
- Each assignment shows launch code, access mode, entry-code requirement, user-code requirement, anonymous practice status, stable QR status, local fallback status, and target game mode count.
- Each assignment shows audio-covered mode count against target game mode count.
- Target-language audio is enabled as a core-safe control.
- Assist language is teacher-optional or support-only and is not described as a progression unlock.
- Local microphone record/replay is teacher-optional and does not imply upload, transcript storage, or cloud scoring.
- Teacher report export is policy-blocked until progress persistence and report policy are accepted.
- AI Tutor and cloud speech scoring remain premium-disabled in the core assignment plans.
- Local/closed companion assignment lists local bundle, update, backup, and export requirements before pilot use.
- Local/closed companion assignment warns if any assigned game mode still needs reviewed audio coverage.

## Student Route Checks

- Launch and Speak It routes show a compact `Teacher settings` card when an assignment plan matches the launch code.
- The card states that English practice unlocks the next activity.
- The card marks support language as `Support only` when available.
- The card shows microphone practice as teacher optional or off, without implying upload, transcript storage, or cloud scoring.
- The card keeps AI Tutor as premium off for foundation routes.
- If no assignment plan matches a future launch code, the student route still renders without crashing.

## Acceptance

A reviewer should be able to identify:

- what a teacher can safely assign today as a demo,
- what requires persistence before classroom reporting,
- what requires school or tenant policy,
- what is premium-disabled to control cost,
- and what remains required for local/closed textbook deployment.
