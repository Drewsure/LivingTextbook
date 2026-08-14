# Publisher Maintenance Contract

The Living Textbook platform must support white-label partners who maintain textbook-linked games, music, video, and teacher reporting across yearly editions.

This is a core product requirement, not a later custom-services add-on.

## Product Promise

A publisher can own its educational source material and media library while the platform owns:

- stable QR and entry-code routes,
- reviewed unit packages,
- reusable game-mode availability records,
- audio-supported learner flows,
- local and hosted media manifests,
- progress event contracts,
- teacher report policy,
- edition-safe release history.

## Required Maintenance Domains

Every partner package needs review across five domains:

1. Content: PDF, DOCX, spreadsheet, manuscript, or curriculum source files are reviewed before they become student-facing packages.
2. Media: audio, music, video, posters, playlists, and optional game-background media have rights, ownership, version, and delivery metadata.
3. Games: each unit records which game modes are required, optional, hidden, premium, or teacher-only.
4. Routes: printed QR codes resolve stable platform identifiers, not temporary dev URLs or direct local files.
5. Reports: teacher reporting is enabled only when privacy, retention, role, and export policy are accepted.

## Release Windows

Pilot package:
- Used for one small proof with reviewed content, media, games, routes, and teacher summary.
- Must prove mobile play, media fallback, and route stability.

Annual edition package:
- Used before a new textbook print or school-year rollout.
- Must freeze route identifiers, media manifests, game availability, and rollback records.

Mid-year refresh:
- Used only for non-breaking content fixes or bonus media/game availability.
- Must not change printed QR meaning or report schema without explicit approval.

## Standing Rules

- Publisher maintenance is a first-class white-label feature.
- Music and video may support games as optional background media, but core learner audio remains separate and always accessible.
- Old printed QR codes must continue resolving to a safe route or clear edition message.
- Hosted and local packages must share the same manifest vocabulary.
- Partner media cannot be copied into public demo folders without rights approval.
- One-off partner games cannot bypass shared engine and progress-event contracts.

## Shared Guard

Publisher maintenance plans must pass the shared `validatePublisherMaintenancePlan` guard before partner self-maintenance, yearly edition updates, media replacement, game availability changes, QR alias updates, report policy changes, or local/hosted package release work can be treated as valid.

The guard requires content, media, games, routes, and reports domains; pilot, annual, and mid-year release windows; media, game, and route change-request coverage; standing rules for first-class white-label maintenance, learner-audio separation, printed QR continuity, and hosted/local manifest compatibility; and blocked redirect changes until rollback and notice rules are reviewed.

The `/teacher/intake` panel must show `Maintenance guard active`, `Maintenance guard blocks`, and `Maintenance guard warnings`.

## Current Implementation

- Sample data: `apps/web/src/data/samplePublisherMaintenancePlan.ts`
- Panel: `apps/web/src/features/publisher/PublisherMaintenancePlanPanel.tsx`
- Shared guard: `packages/content-model/src/publisherMaintenance.ts`
- Route: `/teacher/intake`
