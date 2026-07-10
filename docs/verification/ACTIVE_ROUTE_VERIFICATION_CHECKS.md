# Active Route Verification Checks

Run after adding or changing routes.

## Required Local Checks

- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web`
- `npm run verify:routes`

When the local dev server is already running, these can be run together:

- `npm run verify:foundation`

## Minimum Browser Checks

Open:

- `http://127.0.0.1:3000/`
- `http://127.0.0.1:3000/teacher/intake`
- `http://127.0.0.1:3000/launch/demo-unit-1`
- `http://127.0.0.1:3000/training/demo-unit-1?focus=sentence-review`
- `http://127.0.0.1:3000/launch/partner-demo-unit-1`
- `http://127.0.0.1:3000/teacher/sessions/demo-unit-1`
- `http://127.0.0.1:3000/teacher/sessions/partner-demo-unit-1`
- `http://127.0.0.1:3000/q/tenant/sample-publisher/series/starter-english/book/level-1/unit/unit-1/activity/hello-friends/language/en/edition/2026/version/1.0.0`

## Product Checks

- Routes load without 500 errors.
- Key routes also confirm expected page text, including teacher intake publish gate, media playlist route, and teacher session media engagement.
- Student routes preserve target-language progression gates.
- Teacher/admin routes do not imply live production storage unless persistence is accepted.
- Sample publisher routes remain white-label and do not depend on MiniStar-only branding.
- Stable QR alias route resolves through the route registry concept, not a direct media file.
- Planned QR routes marked `stableQrReady: false` may return 404 and must not be listed as active routes.
