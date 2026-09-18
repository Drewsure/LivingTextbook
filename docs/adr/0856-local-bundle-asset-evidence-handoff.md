# ADR 0856: Local Bundle Asset Evidence Handoff

## Status

Accepted for foundation rehearsal.

## Context

Manifest paths and resolver success are necessary but insufficient for a safe
closed companion package. Each asset also needs rights, checksum, scan,
mapping, and accessibility evidence. Image assets have an additional alt-text
requirement.

## Decision

Add a review-only per-asset evidence handoff panel and enforce scan,
target-mapping, and image alt-text requirements whenever a manifest claims
offline readiness.

## Boundaries

The panel and validator do not perform uploads, file reads, scans, rights
approval, mapping writes, alt-text editing, package copying, publishing,
caching, offline activation, or student-facing promotion.

## Consequences

The package handoff can identify the exact asset that blocks readiness rather
than hiding incomplete evidence behind a bundle-level status. A future loader
must consume these validated fields and retain the same tenant and privacy
boundaries.
