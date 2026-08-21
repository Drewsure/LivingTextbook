# 2026-08-21 AI Generator Settings Contract Gate

Added a game mode settings contract gate to the AI teaching game generator.

The generator plan now requires generated drafts to name settings backend records before package review. Each sample request also carries settings profile references and settings backend gates, making the rule visible on teacher intake and generator routes.

This prevents generated drafts from bypassing timer, difficulty, motion, attempts, background media, skin, arcade speed, scoring, support-language, media-only progress, or learning-audio priority rules.

Verification:

- `npm run verify:ai-generator`
- `npm run verify:routes`
- `npm run verify:foundation`
