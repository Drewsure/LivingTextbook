# ADR 0131: Local Companion Handoff Storage Contract

## Status

Accepted

## Context

The local companion package preview includes a handoff checklist that separates publisher, platform, and school-owned requirements. The checklist needed a storage contract before future local package generation.

## Decision

Add local companion handoff records across durable record planning, hosted/local adapter write intents, backend schema draft, migration candidates, and migration specs.

## Consequences

- Closed/local package handoff has an auditable record shape.
- Future installers and local servers can read the same offline-ready gate.
- Missing media rights, checksums, source files, routes, or report policy continue to block offline-ready claims.
