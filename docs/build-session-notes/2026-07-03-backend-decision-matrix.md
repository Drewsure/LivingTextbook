# Build Session Note: Backend Decision Matrix

Date: 2026-07-03

## Purpose

Add a vendor-neutral backend decision matrix before selecting Supabase, Firebase, SQLite, local storage, or another provider.

## Added

- Backend decision matrix sample data.
- Backend decision matrix panel on `/teacher/intake`.
- Backend decision matrix contract document.
- Backend decision verification checklist.
- Decision register entry DR-039 and ADR-0039.

## Product Guardrail

The current recommendation is a hosted managed database pattern for the first real pilot, not a final vendor choice. Local/closed deployment remains compatible but deferred as a first-pilot cost center unless required.

## Verification Needed

After local pull:

- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web`
- Browser check `http://127.0.0.1:3000/teacher/intake`
