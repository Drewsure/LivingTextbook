# Publisher Maintenance Verification Checks

Use these checks after pulling connector-side commits locally.

## Local Commands

```powershell
cd "D:\LIVING TEXTBOOOK PROJECT\LivingTextbook"
git restore apps/web/next-env.d.ts
git pull --ff-only
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
npm run dev --workspace @living-textbook/web -- --hostname 127.0.0.1 --port 3000
```

## Browser Route

Open:

- `http://127.0.0.1:3000/teacher/intake`

## Visual Checks

Confirm the page includes a `Publisher maintenance` panel with:

- the partner promise,
- ready-domain, owner-decision, and guardrail metrics,
- pilot, annual-edition, and mid-year refresh windows,
- standing rules for QR stability, media ownership, local/hosted manifests, and game contracts,
- maintenance item cards for content, media, games, routes, and reports.

## Product Checks

Confirm the panel makes these rules clear:

- publisher audio/video/music maintenance is core to the platform,
- music/video can support games but does not replace required learner audio,
- printed QR codes must not point to temporary URLs, localhost, or direct files,
- yearly media changes require versioned manifests,
- games remain tied to reusable engines and standard progress events,
- teacher reports require privacy, retention, role, and export policy.

## Acceptance

Do not mark this slice locally verified until typecheck/build pass and `/teacher/intake` renders the publisher maintenance section without console errors.
