# ADR 0132: Local Companion Generated Manifest Snapshot

## Status

Accepted

## Context

The local companion preview now has bundle metadata, handoff checklist, and preflight blockers. It still needed a visible machine-readable package preview for future exporter work.

## Decision

Render a generated JSON-style manifest snapshot from the local bundle and handoff data on `/local/sample-publisher`.

## Consequences

- Future exporter work has a concrete visible target.
- The route remains preview-only and not a signed/offline-ready package.
- The offline-ready gate remains derived from manifest readiness, handoff blockers, and preflight blockers.
