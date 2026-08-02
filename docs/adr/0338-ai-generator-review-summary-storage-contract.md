# ADR 0338: AI Generator Review Summary Storage Contract

## Status
Accepted

## Context
The AI generator review summary helps teachers and reviewers understand section readiness before reading detailed panels. Because it summarizes important blockers, it needs a backend-neutral storage contract before future hosted or local implementations can rely on it.

## Decision
Add `ai_generator_review_summary` / `ai-generator-review-summary` to the storage contract.

The record preserves:

- section readiness rollup
- primary blockers
- next required records
- source record links
- blocked actions

Hosted and local adapters must keep live generation, app patch generation, package assembly, route registry writes, media playlist writes, assignment writes, local bundle writes, and student-ready markers blocked from the summary alone.

## Consequences
The review summary becomes a durable admin record candidate, not a workflow permission. Detailed source records remain authoritative for any future generation, integration, publishing, or assignment path.
