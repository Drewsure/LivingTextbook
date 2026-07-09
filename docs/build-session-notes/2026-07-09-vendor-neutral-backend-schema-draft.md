# Build Session Note: Vendor-Neutral Backend Schema Draft

Date: 2026-07-09

## Session Fit

This belongs to Sessions 3, 6, and 7 because it prepares the first real pilot backend without choosing a storage vendor too early.

It is foundation work. It does not add production persistence, migrations, auth, billing, or premium polish.

## Added

- Vendor-neutral schema draft sample data.
- Backend schema draft panel on `/teacher/intake`.
- Contract documentation.
- Focused verification checklist.
- ADR and focused decision-register entry.

## Product Rule Reinforced

Backend selection must follow the Living Textbook record model, not the other way around. Tenant boundaries, package releases, QR aliases, media manifests, launch sessions, progress events, publish gates, and approval ledgers are platform concepts.

## Local Verification

Pull latest `legacy-source-import`, run typecheck/build, then verify:

- `http://127.0.0.1:3000/teacher/intake`

Use:

- `docs/verification/BACKEND_SCHEMA_DRAFT_CHECKS.md`
