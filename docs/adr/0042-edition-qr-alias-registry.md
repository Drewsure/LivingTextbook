# ADR 0042: Edition QR Alias Registry

Date: 2026-07-03

## Status

Accepted

## Context

The route contracts already define permanent QR as a future requirement. The platform now needs a visible foundation for how printed QR codes survive edition changes and local/hosted deployment changes before a full resolver route is implemented.

A textbook partner may print QR codes before the app changes several times. If those QR codes point directly to unstable routes, local files, or raw media, the product becomes fragile and difficult to support.

## Decision

Add an edition-aware QR alias scaffold to `/teacher/intake`.

The first scaffold records:

- active current-edition alias,
- legacy previous-edition alias,
- draft future-edition alias,
- blocked direct-file alias example,
- redirect rules,
- target path and deployment target,
- package id and local bundle id where applicable.

## Consequences

Positive:

- Keeps printed QR permanence visible from the start.
- Prevents direct file, localhost, and raw media QR targets.
- Supports annual edition planning.
- Keeps local bundle and hosted route options aligned.

Tradeoffs:

- The resolver route is still not implemented.
- Alias records are sample data until persistence is selected.

## Verification

Use `docs/verification/EDITION_QR_ALIAS_CHECKS.md` after pulling connector-side commits.
