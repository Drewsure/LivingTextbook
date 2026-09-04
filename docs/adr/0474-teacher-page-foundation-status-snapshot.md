# ADR 0474: Teacher Page Foundation Status Snapshot

Status: Accepted

Date: 2026-09-02

## Context

The MiniStar teacher page is the most likely first teacher/admin landing surface. It already offers launch, game, media, reporting, persistence, and entitlement shortcuts, but the current project state was only visible inside the larger `/teacher/intake` control room.

The build needs a compact non-technical status snapshot on the teacher page so the user can see the foundation stage without hunting through the full dashboard.

## Decision

Add a `FoundationStatusSnapshotPanel` to `/teacher`.

The snapshot shows:

- Structure first
- 88 active routes checked
- Tenant boundary visible
- Z.ai intake not yet
- Link to `/teacher/intake`

## Guardrails

- The snapshot is informational only.
- It cannot activate live features, classroom launch, learner data collection, report export, or Z.ai imports.
- It must keep the future Z.ai intake alert visible until Codex explicitly signals readiness.
- Active route verification must protect the snapshot text on `/teacher`.

## Verification

- `npm.cmd run verify:review-keys`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`
