# 2026-07-01: Selection Engine Preview

Status: connector-side implementation complete; local typecheck/build still required after pull.

## Scope

Added the second parent-engine scaffold after the playable pairing/Memory Match path.

Implemented:

- `selectionEngineAdapter.ts` for deterministic, reviewed-payload selection rounds.
- `SelectionEnginePreview.tsx` for dashboard display.
- Dashboard integration on `http://127.0.0.1:3000/`.
- Selection engine scaffold contract and verification checklist.
- ADR and decision-register entry.

## Verification Route

- `http://127.0.0.1:3000/`

## Human Pull Commands

```powershell
cd "D:\LIVING TEXTBOOOK PROJECT\LivingTextbook"
git restore apps/web/next-env.d.ts
git pull --ff-only
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
npm run dev --workspace @living-textbook/web -- --hostname 127.0.0.1 --port 3000
```

## Notes

This is not a playable student game yet. It is a parent-engine preview so future Quiz, Balloon Pop, Whack-a-Mole-style, and arcade-selection prototypes have a clean integration target.
