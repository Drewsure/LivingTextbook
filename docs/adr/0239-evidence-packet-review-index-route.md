# ADR 0239: Evidence Packet Review Index Route

## Status

Accepted.

## Context

Upload, Labelled Diagram, and media asset workspaces each expose review-only evidence packet flows. Reviewers also need one tenant-scoped place to see the combined blockers before anyone adds live evidence upload, signed approval capture, promotion, publishing, playlist creation, route creation, or assignment shortcuts.

## Decision

Add `/teacher/evidence/sample-publisher` as a review-only evidence packet index route. The route rolls up upload, Labelled Diagram, and media evidence sources; shows the required storage contract records; and keeps standing blocked actions visible.

## Consequences

- Teacher/admin review can see cross-source evidence readiness without opening every workspace first.
- The route remains a command-center preview, not a live approval or upload surface.
- Partner demo and active route verification now include the evidence index.
- Future live upload, approval, and release workflows must preserve this review index and its blocked-action language until the backend, identity, storage, and release gates are accepted.
