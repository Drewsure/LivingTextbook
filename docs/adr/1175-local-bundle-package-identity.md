# ADR 1175: Local Bundle Package Identity

## Status

Accepted

## Context

The local companion preview already resolved declared QR routes and media
assets within a tenant boundary, but the preview created generic curriculum,
series, book, and unit identifiers. That weakened the connection between a
white-label package and the content it was intended to deliver.

## Decision

Bind every sample local bundle to explicit tenant-owned curriculum, series,
book, and unit identifiers. Require complete package identity in the shared
read-only resolver before any route or asset can resolve. Require every QR
route and local media asset to carry a `unit_id` included in the package unit
scope.

## Consequences

Local package rehearsal is now meaningfully package-bound and can reject an
incomplete identity instead of silently resolving generic preview data. The
resolver also rejects routes or media assets that point outside the declared
unit scope. The
change preserves the review-only boundary: no file access, bundle write,
offline activation, learner-data persistence, or release approval is enabled.
The teacher evidence surface also shows unit scope and counts it toward
handoff readiness.

## Verification

The local bundle readiness gate checks the identity contract and the resolver
runtime test rejects a manifest missing curriculum or unit identity. Full
foundation verification remains required.
