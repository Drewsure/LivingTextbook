# Architecture Notes

## Initial Recommendation

Use `Drewsure/ministar-lab` as the starting point for the canonical web app because it already points toward a multi-tenant Living Textbook platform and has a structured Prisma schema.

Use `Drewsure/ai-quiz-builder-emergent` as the main source for worksheet ingestion and AI-driven game generation.

Use `Drewsure/ministar-game-studio-ai` as the main source for polished interface patterns, public/product pages, analytics pages, student profile work, and Supabase-era ideas.

Use the new curriculum documents as the organizing spine for the product:

- `MINISTAR ENGLISH 8 LEVELS x 40 UNITS.docx`
- MiniStar English Global Lab master curriculum blueprint

## Main Compatibility Risk

The biggest conflict is the data/auth layer:

- `ministar-lab` uses Prisma.
- `ai-quiz-builder-emergent` uses FastAPI, MongoDB, and JWT auth.
- `ministar-game-studio-ai` uses Supabase.

This should be resolved before feature porting accelerates.

## Practical Backend Options

### Option A - Next.js + Prisma/Postgres

Pros:

- Matches `ministar-lab`.
- Good fit for a unified SaaS-style product.
- Keeps schema controlled in the repo.

Cons:

- Supabase auth and MongoDB data models need migration.
- Python document processing either needs a service boundary or rewrite.

### Option B - Supabase-First

Pros:

- Matches `ministar-game-studio-ai`.
- Built-in auth, database, storage, and policies.
- Good for fast product development.

Cons:

- `ministar-lab` Prisma model must be converted.
- Some advanced service logic may still need backend functions or a separate service.

### Option C - Hybrid Web App + Python AI Service

Pros:

- Keeps the best parts of the FastAPI worksheet pipeline.
- Lets the main web app stay focused on product UX.
- Cleaner path for PDF/DOCX/image extraction.

Cons:

- More deployment moving parts.
- Requires clear API contracts.

## Current Lean

Start with Option C during consolidation:

- `apps/web`: Next.js app
- `apps/ai-service`: Python/FastAPI ingestion and AI service
- Shared schema/types documented in `packages/content-model`

Later, decide whether the AI service remains separate or is folded into the web app.
