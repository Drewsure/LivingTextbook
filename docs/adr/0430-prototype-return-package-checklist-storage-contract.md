# ADR 0430: Prototype Return Package Checklist Storage Contract

## Status

Accepted

## Context

ADR 0429 added a visible returned prototype package checklist. The next foundation requirement is durable hosted/local record vocabulary so the checklist can later survive backend, local companion, or hybrid deployment work without becoming a live archive importer.

## Decision

Add `prototype_return_package_checklist` / `prototype-return-package-checklist` as a backend-neutral storage category across schema drafts, migration candidates, migration specs, durable record plans, hosted adapter plans, local adapter plans, shared persistence categories, and validators.

The record preserves evidence requirements only. It does not store returned archive bytes or authorize importing files into `apps/web`.

## Consequences

- Returned Z.ai, Phaser, DOM reference, or outside-builder packages can later be tracked consistently across hosted and local deployments.
- Codex can review source manifests, fixtures, event/scoring replay, target-language audio coverage, mobile evidence, and wrapper boundary notes without permitting direct integration.
- Archive import, direct app copies, route replacement, scoring mutation, rewards, playlists, package promotion, assignment, and support-language progress remain blocked.
