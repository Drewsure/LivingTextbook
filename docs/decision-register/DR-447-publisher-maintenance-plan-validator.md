# DR-447: Publisher Maintenance Plan Validator

## Status

Accepted.

## Context

White-label publishers need year-on-year maintenance for textbook content, audio, music, video, games, QR aliases, local bundles, and teacher reports. The existing maintenance queue made the workflow visible, but it still relied on sample data conventions instead of a shared guard.

## Decision

Add a shared `validatePublisherMaintenancePlan` guard in the content model and require `/teacher/intake` to show its active guard, guard blocks, and guard warnings.

The guard requires content, media, games, routes, and reports domains; pilot, annual, and mid-year release windows; media, game, and route change-request coverage; white-label maintenance standing rules; learner-audio separation; printed QR continuity; and redirect changes staying blocked until rollback and notice rules are reviewed.

## Consequences

- Publisher self-maintenance remains a first-class white-label goal without enabling live uploads, route mutation, media replacement, report changes, or package release.
- Ready-for-release maintenance requests cannot carry unresolved blockers.
- QR redirect requests stay blocked until rollback and school/publisher notice rules exist.
- Music and video can support games, but they cannot replace required learner audio or target-language progress triggers.
