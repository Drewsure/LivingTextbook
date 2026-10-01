# ADR 1373: Publisher Intake Starter Workspace

## Status

Accepted for the first publisher intake workflow.

## Context

The platform had a safe command-line manifest starter and a tenant-scoped
upload workspace, but the operator still had to discover the command in a
separate document. That gap makes the first saleable white-label handoff
harder to execute and encourages unsafe ad hoc file handling.

## Decision

Show a tenant-scoped, review-only starter panel in the publisher upload
workspace. It presents a PowerShell command derived from the current tenant and
package manifest, names the Unit 1 source and multimedia lanes, explains the
three preparation steps, and states the protected actions that remain blocked.
The panel creates no files and performs no browser or server write.

## Consequences

- A publisher operator can see the first safe intake action in the product
  workspace rather than relying on hidden engineering instructions.
- The reference publisher and an empty white-label tenant follow the same
  contract without inheriting each other's records.
- Route checks protect the handoff text, while release, QR, persistence, and
  student gates remain unchanged.

## Verification

- `npm run typecheck --workspace @living-textbook/web`
- `node scripts/verify-active-routes.mjs`
- `node scripts/verify-standards-integrity.mjs`
