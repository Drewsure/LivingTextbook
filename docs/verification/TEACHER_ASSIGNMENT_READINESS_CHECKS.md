# Teacher Assignment Readiness Verification

Use this checklist after pulling `legacy-source-import` and running local typecheck/build.

## Route

Open:

- `http://127.0.0.1:3000/teacher/intake`

## Checks

- The page shows a `Teacher assignment readiness` panel below the unit package readiness panel.
- The panel lists assignment plans for MiniStar, the sample publisher front-door pilot draft, and the closed textbook companion draft.
- Each assignment shows launch code, access mode, entry-code requirement, user-code requirement, anonymous practice status, stable QR status, local fallback status, and target game mode count.
- Target-language audio is enabled as a core-safe control.
- Assist language is teacher-optional or support-only and is not described as a progression unlock.
- Local microphone record/replay is teacher-optional and does not imply upload, transcript storage, or cloud scoring.
- Teacher report export is policy-blocked until progress persistence and report policy are accepted.
- AI Tutor and cloud speech scoring remain premium-disabled in the core assignment plans.
- Local/closed companion assignment lists local bundle, update, backup, and export requirements before pilot use.

## Acceptance

A reviewer should be able to identify:

- what a teacher can safely assign today as a demo,
- what requires persistence before classroom reporting,
- what requires school or tenant policy,
- what is premium-disabled to control cost,
- and what remains required for local/closed textbook deployment.
