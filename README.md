# LivingTextbook

Master repository for the Living Textbook / Ministar learning platform consolidation.

This repository gathers the work from these source projects and materials into one coherent system:

- `Drewsure/ministar-lab`
- `Drewsure/ai-quiz-builder-emergent`
- `Drewsure/ministar-game-studio-ai`
- Local Living Textbook source material from `D:\LIVING TEXTBOOOK PROJECT`
- `MINISTAR ENGLISH 8 LEVELS x 40 UNITS.docx`
- MiniStar English Global Lab master curriculum blueprint

## Current Status

This repository has been seeded as the master consolidation target. The first phase is preservation-first: keep each existing project understandable, document what each one contributes, then merge systems intentionally instead of flattening everything into one unstable app.

## Intended Direction

The likely architecture is a monorepo with:

- `apps/web` - the primary Living Textbook web application
- `apps/ai-service` - worksheet ingestion, AI analysis, document parsing, and generation services
- `packages/ui` - shared design system and reusable components
- `packages/games` - reusable game engines and learning activities
- `packages/content-model` - shared curriculum, unit, worksheet, QR, telemetry, and student-progress types
- `content/` - textbook units, lesson material, examples, source documents, and media indexes
- `docs/` - architecture notes, migration plans, and decision records

## Source Projects

See `docs/source-inventory.md` for the first compatibility map.

## Safety Rule

Do not overwrite the original source repositories during consolidation. Import, compare, preserve, then merge deliberately.
