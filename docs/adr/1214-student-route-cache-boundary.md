# ADR 1214: Student Route Cache Boundary

**Status:** Accepted  
**Date:** 2026-09-25

## Context

The local bundle cache policy now requires explicit route coverage, but a
future service worker must also know which routes are safe to cache. Teacher
workspaces and API endpoints can contain operational controls, reports,
credentials, or persistence boundaries and must not be included in a student
offline bundle.

## Decision

Offline-ready cache policies reject route prefixes that cover `/api`, `/admin`,
or `/teacher`. Student-facing QR, launch, activity, and media routes remain
eligible when each is explicitly covered and all other bundle evidence gates
pass. This is a manifest validation rule only; no service worker, cache
mutation, or offline learner-data storage is enabled.

## Consequences

- A future local companion cannot accidentally precache teacher or backend
  surfaces through a broad route prefix.
- Tenant packages must enumerate student-facing routes deliberately.
- Teacher operations remain hosted or explicitly local-provider controlled,
  rather than silently becoming available from a student bundle.

## Verification

`npm run verify:local-bundle` covers rejected teacher and API route prefixes in
addition to route coverage, version, source-document, checksum, rights, scan,
and accessibility evidence.
