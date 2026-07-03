# Edition QR Alias Contract

Printed textbook QR codes must remain stable across annual editions, package updates, hosted deployments, and future local bundles.

This contract defines the alias layer that sits between a printed QR id and the current reviewed Living Textbook target.

## Core Rule

A printed QR should resolve a stable alias first. The alias then points to one of these reviewed targets:

- hosted front door,
- unit launch route,
- game-mode route,
- media playlist,
- teacher preview,
- local bundle entry,
- safe legacy or retired-edition message.

Printed QR codes must not point directly to temporary development URLs, `localhost`, `127.0.0.1`, `file://` paths, unversioned media folders, or raw media files.

## Alias Fields

Each alias should record:

- alias id,
- printed QR id,
- tenant id,
- series id,
- book id,
- unit id,
- activity id,
- language,
- edition,
- version,
- status,
- target type,
- deployment target,
- target path,
- content package id,
- optional local bundle id,
- stability rule,
- next step,
- not-allowed-yet guardrails.

## Statuses

Active:
- Current reviewed alias for the live package or route.

Legacy:
- Old printed QR or old edition alias that must still land safely.

Draft:
- Planned alias for a future edition. Not student-facing.

Blocked:
- Alias intentionally shown as unsafe or incomplete, such as a direct file path.

## Standing Rules

- Route registry comes before resolver implementation.
- Edition changes require reviewed alias updates and rollback notes.
- Legacy aliases should not silently redirect to the wrong edition.
- Local bundle references must use signed manifest ids, not manual folder paths.
- Media QR targets should resolve through playlist or package aliases, not raw media files.
- `/q/...` remains a future resolver route until persistence, package versioning, and local-bundle rules are accepted.

## Current Implementation

- Sample data: `apps/web/src/data/sampleEditionQrAliasPlan.ts`
- Panel: `apps/web/src/features/routes/EditionQrAliasPanel.tsx`
- Route: `/teacher/intake`

## Follow-Up

Promote edition alias records into durable storage after the backend path is selected and before any printed QR commitments are made for real partners.
