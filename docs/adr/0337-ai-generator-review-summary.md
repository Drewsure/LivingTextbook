# ADR 0337: AI Generator Review Summary

## Status
Accepted

## Context
The teacher AI game generator route now contains many review-only panels: request setup, prototype review, integration gates, package review, and draft repair. The route needs a quick tenant-aware summary so reviewers can see blockers before scrolling into detailed evidence.

## Decision
Add an AI generator review summary panel to `/teacher/generator/[tenantId]`.

The summary is tenant-specific and shows:

- section readiness status
- primary blocker
- next required record
- blocked actions
- source records

MiniStar keeps its English target-language progress trigger and hiragana-only Japanese support-language boundary in the summary.

## Consequences
The route remains review-only. The summary does not enable live generation, app file writes, route creation, playlist creation, package promotion, or student assignment. Future generator work must keep this rollup current when new sections or gates are introduced.
