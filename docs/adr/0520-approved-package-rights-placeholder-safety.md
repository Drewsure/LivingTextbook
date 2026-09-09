# ADR-0520: Approved Package Rights And Placeholder Safety

Status: Accepted

## Context

The package model permits incomplete rights and placeholder sources while content is being repaired. Those states must not survive an approved review status, because approval is evidence that a package may move toward release.

## Decision

Reject unknown media rights and placeholder audio cues when package review status is `approved`. Preserve those records for draft/reviewed repair workflows, where they remain visible blockers.

## Consequences

- Approved package evidence is stronger for white-label tenant review and future release providers.
- Content teams can continue iterative repair without pretending drafts are student-ready.
- No storage, upload, provider, QR, assignment, or student-state side effect is introduced.
