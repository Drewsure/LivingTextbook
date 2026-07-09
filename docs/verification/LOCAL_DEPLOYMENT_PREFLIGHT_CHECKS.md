# Local Deployment Preflight Checks

Run these checks when local deployment preflight changes.

## Required Local Checks

- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web`

## Browser Checks

Open:

- `http://127.0.0.1:3000/teacher/intake`

Confirm:

- Local deployment preflight appears before local bundle manifests.
- Hosted PWA is still recommended as the first pilot path.
- Media bundle, installer/update, local reporting, and offline access are blocked.
- QR/deep-link and content bundle checks warn rather than pretend to be complete.

## Product Checks

- Closed local companion remains part of the platform plan.
- Local/closed deployment is not treated as production-ready.
- Backup, restore, export, and update concerns are visible.
