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

## Product Checks

- The panel does not imply that a package draft is a scheduled pilot.
- The panel keeps local/closed deployment visible without prioritizing it over the hosted pilot.
- The panel preserves white-label tenant separation.
