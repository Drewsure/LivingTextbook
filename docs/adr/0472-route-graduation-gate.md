# ADR 0472: Route Graduation Gate

Status: Accepted

Date: 2026-09-02

## Context

The foundation now has many active local scaffold routes. That is useful for validating app structure, but a route returning `200` is not the same as a route being safe for real classrooms, printed QR codes, assignment rollout, report export, or local companion packaging.

The platform needs a visible rule that prevents scaffold routes from becoming accidental product promises.

## Decision

Add a review-only route graduation gate to `/teacher/intake`.

The gate defines four route states:

- Scaffold route
- Student-ready route
- Pilot-ready route
- Production QR route

It also names the evidence required before a route can graduate: route helper contract, tenant navigation boundary, target-language audio coverage, standard progress events, teacher report boundary, private assignment gate, school policy acceptance, backend storage selection, QR alias and rollback plan, and local companion fallback.

## Guardrails

- Scaffold is not production.
- No scaffold route becomes pilot-ready from a link, visible panel, generated package, or local preview alone.
- The gate cannot activate uploads, storage, production QR mutation, classroom launch, learner data collection, report export, direct media-file targets, or support-language-only progress.
- Active route verification must protect the gate text on `/teacher/intake`.

## Verification

- `npm.cmd run verify:review-keys`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`
