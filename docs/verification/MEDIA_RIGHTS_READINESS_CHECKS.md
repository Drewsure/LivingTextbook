# Media Rights Readiness Checks

Run these checks when media rights readiness changes.

## Required Local Checks

- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web`

## Browser Checks

Open:

- `http://127.0.0.1:3000/teacher/intake`

Confirm:

- Media rights readiness appears before deployment/local bundle panels.
- MiniStar audio and video are demo-cleared, not production-cleared.
- Sample publisher audio needs proof.
- Sample publisher video is blocked.
- Missing proof and fallback plans are visible.
- Offline/local bundle permission remains distinct from hosted playback.

## Product Checks

- The panel does not imply placeholder media files are production-ready.
- Optional media can be disabled without breaking games.
- Learner-critical audio fallback remains visible.
