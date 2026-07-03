# DR-042: Edition QR Alias Registry

Status: Accepted

Date: 2026-07-03

## Decision

Model edition-aware printed QR aliases before implementing the full `/q/...` resolver route.

## Reason

White-label textbook partners need printed QR codes that survive annual editions, content package updates, hosted deployments, and future local bundles. A stable alias layer prevents printed codes from pointing directly at temporary development URLs, raw files, or unversioned media paths.

## White-Label Impact

Strongly positive. This lets a publisher maintain its textbook companion package year over year while preserving trust in printed materials.

## Cost Impact

Positive. A simple alias registry is cheaper than repairing broken printed QR codes after books are distributed.

## Constraints

- Printed QR codes resolve aliases, not raw files or temporary routes.
- Alias records must include tenant, series, book, unit, activity, language, edition, and version metadata.
- Legacy aliases should resolve safely rather than failing silently.
- Draft aliases are not student-facing.
- Direct `file://`, `localhost`, `127.0.0.1`, and raw media targets are blocked.
- Local bundle targets require manifest ids and package versioning.
- `/q/...` remains a future resolver route until durable storage, package versioning, and local bundle policy are accepted.

## Follow-Up

Promote alias records into persistence before making real printed QR commitments for a partner or publisher.
