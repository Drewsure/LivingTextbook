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

## Browser Routes

Open:

- `http://127.0.0.1:3000/teacher/intake`
- `http://127.0.0.1:3000/q/tenant/sample-publisher/series/starter-english/book/level-1/unit/unit-1/activity/hello-friends/language/en/edition/2026/version/1.0.0`

## Visual Checks

Confirm `/teacher/intake` includes an `Edition QR aliases` panel with:

- permanence rule,
- active, legacy, draft, and blocked metrics,
- alias cards for 2026 current, 2025 legacy, 2027 draft, and blocked direct-file examples,
- printed QR ids,
- target paths,
- edition/version/package facts,
- redirect rules.

Confirm the `/q/...` preview route includes:

- `Edition QR resolver preview`,
- printed QR id,
- edition, target type, and deployment facts,
- resolved target path,
- guardrails,
- an `Open resolved preview` link only for safe aliases.

## Product Checks

Confirm the panel and preview route make these rules clear:

- printed QR codes resolve aliases first,
- aliases can point to hosted routes, local bundles, or safe edition messages,
- direct `file://`, `localhost`, and raw media targets are blocked,
- legacy QR codes need safe handling,
- draft QR aliases are not student-facing,
- local bundle references need manifest ids,
- `/q/...` is currently a resolver preview, not production redirect infrastructure.

## Acceptance

Do not mark this slice locally verified until typecheck/build pass and `/teacher/intake` plus the sample `/q/...` route render without console errors.
