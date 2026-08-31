# ADR 0467: Persistence Storage Selection Gate Visibility

Status: Accepted

Date: 2026-08-31

## Context

The evidence storage adapter selection gate already exists on the broad teacher intake route. The focused persistence workbench is the more natural home for backend, hosted storage, closed local storage, hybrid archive, migration, and cost-control decisions.

White-label pilots need this visible before uploads, evidence packets, media storage, report exports, local companion packages, or generated package writers become live workflows.

## Decision

Render the shared evidence storage adapter selection gate on `/teacher/persistence` as a review-only panel.

The first pilot recommendation remains hosted managed evidence storage because it is the cheapest practical route for testing access control, audit logs, review workflows, deletion/export policy, and evidence packets before investing in closed local installer, backup, restore, and update tooling.

## Guardrails

- `/teacher/persistence` remains review-only.
- Hosted, local, and hybrid storage choices remain visible without selecting a vendor.
- Local/closed evidence storage remains a premium/policy-gated path.
- No object bucket, local evidence folder, signed URL, direct upload, attachment migration, retention clock, report export, local companion activation, or release-state mutation is enabled by this panel.
- Heavy review lists must use contextual keys so repeated blocker text does not create React duplicate-key warnings.

## Verification

- `npm.cmd run verify:backend-storage`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`
