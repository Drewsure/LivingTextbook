# ADR 0339: AI Generator Reviewer Runbook

## Status
Accepted

## Context
The AI generator route has a route map, review summary, and many detailed panels. Reviewers need a safe order of operations that explains what to inspect first without adding live workflow controls.

## Decision
Add a tenant-aware AI generator reviewer runbook to `/teacher/generator/[tenantId]`.

The runbook shows:

- human review order
- standing rules
- evidence to review
- required record for each step
- blocked shortcuts

MiniStar runbooks preserve English as the target-language trigger and keep Japanese support hiragana-only and support-only.

## Consequences
The runbook is guidance only. Detailed source records remain authoritative, and the runbook cannot call models, generate patches, assemble packages, create routes or playlists, write local bundles, mark student-ready state, or assign students.
