# Source Inventory

This document records the first compatibility pass across the projects and major source materials being combined into the LivingTextbook master repository.

## Drewsure/ministar-lab

Likely role: primary application shell and long-term architecture base.

Observed stack:

- Next.js
- React 19
- TypeScript
- Tailwind / shadcn-style UI dependencies
- Prisma
- SQLite locally, with a path toward Postgres/Neon-style deployment
- Phaser game dependencies

Important concepts already present:

- Tenant model
- Content blocks
- QR routes
- Students
- Telemetry events
- Local fallback behavior when persistence is unavailable
- Student and teacher views
- Game library and game canvas ideas

Compatibility notes:

- Strong candidate for the eventual `apps/web` base.
- Its database model is closer to a durable Living Textbook platform than the other prototypes.
- Needs careful reconciliation with Supabase auth and the FastAPI/Mongo worksheet pipeline.

## Drewsure/ai-quiz-builder-emergent

Likely role: worksheet ingestion, AI analysis, and backend feature source.

Observed stack:

- React frontend
- FastAPI backend
- MongoDB via Motor
- JWT auth
- Python document parsing and generation tools
- PDF, DOCX, text, and image upload processing
- QR code generation
- AI worksheet analysis using Gemini through emergent integrations

Important concepts already present:

- Teacher/student auth
- Worksheet upload and analysis
- Extracted images from worksheets
- Game creation from worksheet content
- Share codes
- Printable QR PDFs
- Leaderboards
- Student progress
- Teacher analytics

Compatibility notes:

- Best source for AI/document-processing behavior.
- Database and auth are different from the other projects, so this should be ported intentionally instead of copied directly into the main app.
- The Python backend may remain as `apps/ai-service`, or its logic can later be moved into Next.js/server actions if that proves cleaner.

## Drewsure/ministar-game-studio-ai

Likely role: polished product/UI source and feature catalog.

Observed stack:

- Vite
- React 18
- TypeScript
- Tailwind
- shadcn/Radix-style components
- Supabase auth and typed database client
- React Router
- TanStack Query

Important concepts already present:

- Landing page
- Auth flow
- Dashboard
- Analytics
- Blog and blog manager
- Admin manual
- Game play routes
- Student profile
- Leaderboard
- Games landing page
- Pricing and community pages

Compatibility notes:

- Strong source for pages, UI patterns, and product surface.
- Uses Supabase, while `ministar-lab` uses Prisma and `ai-quiz-builder-emergent` uses MongoDB.
- Route components can likely be ported into a Next.js app, but routing/auth/data calls must be adapted.

## Local Living Textbook Folder

Likely role: concept archive, curriculum source material, media source, and planning history.

Observed contents:

- Chat history folders: `Chat GPT`, `Claude`, `deepseek`, `Qwen`
- Local `ministar-lab` folder
- Word documents
- PNG image assets
- MP4 video asset

Compatibility notes:

- These files should be cataloged before import.
- Documents can become curriculum notes, product requirements, or source references.
- Media should be copied into a curated content/media area only after naming and size decisions are made.

## Major Curriculum Documents

### MINISTAR ENGLISH 8 LEVELS x 40 UNITS.docx

Likely role: core curriculum sequence and unit map.

Source path observed locally:

- `D:\LIVING TEXTBOOOK PROJECT\MINISTAR ENGLISH 8 LEVELS x 40 UNITS.docx`

Initial handling recommendation:

- Preserve the original DOCX as a source artifact.
- Extract a structured curriculum map later into `content/curriculum/`.
- Treat the 8-level / 40-unit structure as a major organizing spine for the Living Textbook.

### MiniStar English Global Lab Master Curriculum Blueprint

Likely role: master product/curriculum blueprint.

Source path provided by the user:

- `C:\Users\User\.codex\attachments\a1b76186-7c22-4a8a-9554-e31e629b3feb\pasted-text.txt`

Initial handling recommendation:

- Import or summarize as a source blueprint after local read permission is available for the attachment path.
- Use it to validate product structure, curriculum levels, game loop design, teacher/student workflows, and long-term architecture.

## Overall Compatibility Verdict

The projects are compatible at the product-concept level and mostly compatible at the frontend technology level. They are not yet compatible at the backend/data layer.

The safest consolidation path is:

1. Preserve all source projects.
2. Create the master monorepo structure.
3. Import each project into a legacy/reference area.
4. Choose one canonical app shell.
5. Define one canonical data model.
6. Port features one by one into the canonical architecture.
