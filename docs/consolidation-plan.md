# Consolidation Plan

## Phase 0 - Seed the Master Repository

Goal: create the master repo and document the source systems.

Status:

- Created GitHub master repository scaffold.
- Recorded initial source inventory.
- Defined the intended monorepo shape.
- Added the two major curriculum documents to the source map.

## Phase 1 - Preserve the Source Projects

Goal: bring the three existing repositories into the master repository without losing structure.

Recommended layout:

```text
legacy/
  ministar-lab/
  ai-quiz-builder-emergent/
  ministar-game-studio-ai/
```

Rules:

- Do not merge source files into the main app yet.
- Do not rewrite source history until the preservation copy is complete.
- Keep dependency files intact for comparison.
- Add a note to each imported project describing its original repo URL and import date.

## Phase 2 - Establish the Canonical Architecture

Recommended layout:

```text
apps/
  web/
  ai-service/
packages/
  ui/
  games/
  content-model/
  config/
content/
  source-index/
  curriculum/
docs/
```

Recommended choices:

- Use Next.js as the main app shell, likely based on `ministar-lab`.
- Use Prisma/Postgres or Supabase/Postgres as the canonical database direction.
- Keep Python/FastAPI only if document parsing and AI pipelines remain cleaner as a separate service.
- Extract shared game logic into `packages/games`.
- Extract reusable UI into `packages/ui`.

## Phase 3 - Define the Unified Product Model

Core entities to reconcile:

- Tenant / school / organization
- Teacher
- Student
- Course
- Level
- Unit
- Lesson
- Worksheet
- Extracted asset
- Vocabulary term
- Game
- QR route
- Game session
- Telemetry event
- Leaderboard entry
- Student progress
- Achievement

## Phase 4 - Port Features

Recommended port order:

1. App shell and navigation
2. Shared design system
3. Student play flow
4. Teacher dashboard
5. Worksheet upload and AI analysis
6. Game generation
7. QR routes and printable QR PDFs
8. Analytics and telemetry
9. Blog/admin/manual/community surfaces
10. Curriculum/content library

## Phase 5 - Curate Local Living Textbook Materials

Recommended layout:

```text
content/source-index/
  local-files.md
  chat-history-index.md
  media-index.md
content/curriculum/
  ministar-8-levels-40-units.md
  master-blueprint.md
```

Rules:

- Do not bulk-copy huge media files until naming and storage decisions are made.
- Preserve original filenames in the index.
- Add human-friendly titles and descriptions during curation.
- Convert DOCX/source text into structured markdown only after preserving original source locations.
