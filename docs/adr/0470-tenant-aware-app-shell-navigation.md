# ADR 0470: Tenant-Aware App Shell Navigation

Status: Accepted

Date: 2026-09-01

## Context

The shared app shell displayed several sample-publisher workbench links on every non-compact page. That was useful during early scaffolding, but it creates white-label risk because MiniStar pages can appear to link into partner-owned uploads, evidence packets, release-control, assets, and local previews.

Navigation is part of tenant boundary enforcement. A route can render the right content but still leak the wrong product model if its header points to another tenant's review surfaces.

## Decision

Make `AppShell` build navigation links from the current tenant.

Shared platform workbenches remain visible, while tenant-scoped links now resolve to the current tenant for source review, AI generator, prototype review, tenant review queue, media library, local preview, and session monitor when those routes exist. Sample-publisher-only operational workbenches remain available only on sample-publisher branded pages.

## Guardrails

- MiniStar shell navigation must not expose sample-publisher-only upload, evidence, asset, release-control, media library, local preview, or partner session links.
- Sample-publisher shell navigation must not expose MiniStar media ownership, local preview, or MiniStar session links.
- Navigation links are review shortcuts only. They cannot activate uploads, media replacement, evidence export, release-control mutation, local package export, scoring, rewards, assignments, or live classroom launch.
- Future tenant routes should enter the shell through route helpers or tenant navigation data, not hand-written cross-tenant URLs.
- Active route verification must check positive tenant links and forbidden cross-tenant links on representative tenant media-library pages.

## Verification

- `npm.cmd run verify:upload-channels`
- `npm.cmd run verify:review-keys`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`
