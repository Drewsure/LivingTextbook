# Game Prototype Assignment Verification Checks

Use these checks after pulling connector-side commits locally.

## Local Commands

```powershell
Set-Location -LiteralPath "D:\LIVING TEXTBOOOK PROJECT\LivingTextbook"
git fetch origin legacy-source-import
 git restore apps/web/next-env.d.ts
git pull --ff-only
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
npm run dev --workspace @living-textbook/web -- --hostname 127.0.0.1 --port 3000
```

If `git pull --ff-only` still says already up to date but the new panel is missing, run:

```powershell
git fetch origin legacy-source-import
git status --short --branch
git log --oneline -5 --decorate
```

## Browser Route

Open:

- `http://127.0.0.1:3000/teacher/intake`

## Visual Checks

Confirm the page includes a `Prototype assignments` panel with:

- a DOM/React versus Phaser decision rule,
- counts for DOM reference and Phaser assignments,
- Sentence Builder marked as DOM reference,
- Balloon Pop and Whack-a-Mole marked as Phaser,
- Maze Chase deferred,
- acceptance gates and not-allowed-yet guardrails.

## Product Checks

Confirm the panel makes these rules clear:

- Phaser is preferred for action, reflex, physics, and motion-heavy modes,
- DOM/reference prototypes are preferred first for syntax, spelling, quiz, and report-heavy modes,
- Sentence Builder starts DOM/reference because accessibility, audio, and event output matter first,
- Phaser prototypes still require LivingTextbook event, audio, scoring, and white-label review before integration,
- Z.ai work remains isolated in `Drewsure/ministar-lab` until Codex review.

## Acceptance

Do not mark this slice locally verified until typecheck/build pass and `/teacher/intake` renders the `Prototype assignments` panel without console errors.
