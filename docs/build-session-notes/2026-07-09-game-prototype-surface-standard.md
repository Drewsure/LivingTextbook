# Build Session Note: Game Prototype Surface Standard

Date: 2026-07-09

## Added

- `apps/web/src/data/sampleGamePrototypeAssignmentPlan.ts`
- `apps/web/src/features/game-offers/GamePrototypeAssignmentPanel.tsx`
- `/teacher/intake` integration
- `docs/GAME_PROTOTYPE_SURFACE_STANDARD.md`
- `docs/decision-register/DR-043-game-prototype-surface-standard.md`
- `docs/adr/0043-game-prototype-surface-standard.md`
- `docs/verification/GAME_PROTOTYPE_ASSIGNMENT_CHECKS.md`
- updated `docs/agent-briefs/ZAI_GAME_PROTOTYPE_DIRECTIVES.md`
- updated decision and verification indexes
- added `docs/operating-notes/2026-07-09-stale-local-origin-after-connector-commits.md`

## Why

The project needed a durable answer to whether Z.ai should build static/DOM games or Phaser games. The decision is now mode-specific:

- Phaser for action, motion, collision, physics, timing, and reflex modes.
- DOM/React reference prototypes for text, syntax, spelling, quiz, and reporting-heavy modes.

Sentence Builder remains DOM/reference first because accessible text, tap-to-speak, deterministic scoring, and event output matter before premium animation.

## Verification Needed

Connector-side changes still need local verification:

```powershell
Set-Location -LiteralPath "D:\LIVING TEXTBOOOK PROJECT\LivingTextbook"
git fetch origin legacy-source-import
git restore apps/web/next-env.d.ts
git pull --ff-only
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
npm run dev --workspace @living-textbook/web -- --hostname 127.0.0.1 --port 3000
```

Open `http://127.0.0.1:3000/teacher/intake` and verify the `Prototype assignments` panel.
