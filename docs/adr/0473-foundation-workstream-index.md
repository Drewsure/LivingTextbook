# ADR 0473: Foundation Workstream Index

Status: Accepted

Date: 2026-09-02

## Context

`/teacher/intake` has become the main foundation control room. It now contains route, QR, upload, media, game, teacher-operation, policy, evidence, backend, persistence, and local companion gates.

That depth is valuable, but without a compact index the page becomes difficult for teachers, partners, and future agents to understand quickly.

## Decision

Add a visible foundation workstream index near the top of `/teacher/intake`.

The index shows:

- Visible build map
- Route and QR safety
- Content intake and uploads
- Game engine readiness
- Audio, media, and language
- Teacher operations and reporting
- Pilot, policy, and evidence
- Backend, persistence, and local companion
- Future Z.ai intake alert

## Guardrails

- The index is informational, not a launcher.
- It cannot activate live features, student data collection, public community libraries, unmanaged asset adoption, direct AI publish, or Z.ai imports.
- The current build focus must remain structure, tenant boundaries, route graduation, audio-first games, evidence packets, and backend-neutral storage contracts before premium polish.
- Active route verification must protect the index text on `/teacher/intake`.

## Verification

- `npm.cmd run verify:review-keys`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`
