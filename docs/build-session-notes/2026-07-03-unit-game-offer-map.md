# Build Session Note: Unit Game Offer Map

Date: 2026-07-03

## Added

- `apps/web/src/data/sampleUnitGameOfferMap.ts`
- `apps/web/src/features/game-offers/UnitGameOfferMapPanel.tsx`
- `/teacher/intake` integration
- `docs/UNIT_GAME_OFFER_MAP_CONTRACT.md`
- `docs/verification/UNIT_GAME_OFFER_MAP_CHECKS.md`
- `docs/decision-register/DR-041-unit-game-offer-map.md`
- `docs/adr/0041-unit-game-offer-map.md`

## Why

The platform needs a maintainable white-label way to define which games are offered per unit before building more modes. This protects the parent-engine strategy and gives publishers a path to yearly game maintenance.

## Verification Needed

The connector-side commit still needs local verification:

```powershell
Set-Location -LiteralPath "D:\LIVING TEXTBOOOK PROJECT\LivingTextbook"
git restore apps/web/next-env.d.ts
git pull --ff-only
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
npm run dev --workspace @living-textbook/web -- --hostname 127.0.0.1 --port 3000
```

Then open `http://127.0.0.1:3000/teacher/intake` and review the `Game offer map` panel.
