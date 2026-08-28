# Teacher Assignment Rollout Checks

Run these checks when assignment rollout changes.

## Required Local Checks

- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web`

## Browser Checks

Open:

- `http://127.0.0.1:3000/teacher/intake`

Confirm:

- Assignment rollout appears after teacher assignment readiness.
- MiniStar rollout is marked demo-preview.
- Sample publisher rollout is blocked.
- Local companion rollout is blocked.
- Gate cards show pass, warning, and blocked statuses.
- Media rights, report policy, progress persistence, local bundle, and local storage blockers are visible.
- Game audio coverage is visible before scheduling, with local companion coverage still under review.
- Generated-package handoff evidence is visible as review-only evidence under rollout.

## Product Checks

- The panel does not imply that a package draft is a scheduled pilot.
- The panel keeps local/closed deployment visible without prioritizing it over the hosted pilot.
- The panel preserves white-label tenant separation.
- The panel does not allow scheduling around missing assigned-game audio coverage.
- The panel shows generated-package handoff evidence as review-only.
- The panel does not allow assignment handoff evidence to schedule a class, activate links, bind rosters, start progress streams, export reports, launch classrooms, or store raw learner audio/transcripts.
