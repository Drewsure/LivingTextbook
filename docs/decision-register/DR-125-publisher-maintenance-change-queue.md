# DR-125: Publisher Maintenance Change Queue

## Decision

Add a maintenance change queue to the publisher maintenance panel.

## Reason

Yearly textbook, media, game, QR, and report updates need a reviewable workflow before they become package releases. A queue makes the partner maintenance story operational without building production admin editing yet.

## Standard

- `/teacher/intake` shows `Maintenance change queue`.
- Change requests identify domain, requester, target edition, change type, status, and route impact.
- Each request lists media impact, game impact, report impact, required approvals, blockers, and next action.
- Media replacement requires rights and manifest review.
- Game additions require audio coverage and mobile route checks.
- QR changes require fallback, redirect, rollback, and old-edition behavior before alias updates.
- The active route verifier checks the queue remains visible on `/teacher/intake`.
