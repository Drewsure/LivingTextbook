# DR-544: Foundation Workstream Index

Status: Accepted

Date: 2026-09-02

Decision: Add a visible foundation workstream index near the top of `/teacher/intake`.

## Rationale

- The teacher/admin foundation route has grown into a control room.
- A visible index helps teachers, partners, and future agents understand the build lanes before entering detailed review panels.
- The index preserves the future Z.ai intake alert without inviting premature prototype imports.

## Guardrails

- No live feature activation.
- No student data collection.
- No public community library.
- No unmanaged asset adoption.
- No direct AI publish.
- No Z.ai import before the intake alert.

## Verification

- `npm.cmd run verify:review-keys`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`
