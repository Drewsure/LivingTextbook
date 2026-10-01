# ADR 1401: Show The Canonical Publisher Handoff In The Tenant Workspace

## Status

Accepted for the first saleable white-label pilot foundation.

## Context

The intake kit and canonical source-manifest bridge are executable, but an
operator should not have to discover the second command from a repository
file. The publisher requirements workspace is the correct tenant-scoped place
to show the next safe handoff and its blocked boundaries.

## Decision

Show the create-once bridge command, its source-preflight next step, and the
remaining blocked actions in `PublisherPilotInputKitPanel`. Verify those
markers on the tenant requirements route. Keep the panel informational: it
does not execute commands, upload files, assemble packages, print QR codes,
activate persistence, or enable students.

## Consequences

- A publisher or school operator can follow the intended intake sequence
  without guessing which manifest is canonical.
- The user-facing surface stays aligned with the review-only safety contract.
- Runtime route verification now depends on a running preview server for the
  browser check; static typecheck and foundation checks remain independent.

## Verification

- `npm run typecheck --workspace @living-textbook/web`
- `node scripts/verify-foundation-composition.mjs`
- `npm run verify:routes` with the web preview running
