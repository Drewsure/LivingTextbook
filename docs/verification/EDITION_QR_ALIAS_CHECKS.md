# Edition QR Alias Verification Checks

Use these checks after pulling connector-side commits locally.

## Local Commands

```powershell
Set-Location -LiteralPath "D:\LIVING TEXTBOOOK PROJECT\LivingTextbook"
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

Confirm the page includes an `Edition QR aliases` panel with:

- permanence rule,
- active, legacy, draft, and blocked metrics,
- alias cards for 2026 current, 2025 legacy, 2027 draft, and blocked direct-file examples,
- printed QR ids,
- target paths,
- edition/version/package facts,
- redirect rules.

## Product Checks

Confirm the panel makes these rules clear:

- printed QR codes resolve aliases first,
- aliases can point to hosted routes, local bundles, or safe edition messages,
- direct `file://`, `localhost`, and raw media targets are blocked,
- legacy QR codes need safe handling,
- draft QR aliases are not student-facing,
- local bundle references need manifest ids,
- `/q/...` is not yet implemented as a real resolver.

## Acceptance

Do not mark this slice locally verified until typecheck/build pass and `/teacher/intake` renders the `Edition QR aliases` panel without console errors.
