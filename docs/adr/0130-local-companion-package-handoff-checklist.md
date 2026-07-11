# ADR 0130: Local Companion Package Handoff Checklist

## Status

Accepted

## Context

The local companion route showed bundle metadata, media assets, QR fallback routes, and local preflight blockers. It still needed a concrete handoff checklist for publisher conversations.

## Decision

Add handoff checklist data to local bundle manifests and render it on `/local/sample-publisher`.

## Consequences

- Publisher-facing package requirements become clearer.
- The route stays honest about missing media rights, checksums, and reporting policy.
- Future local package generation has a practical artifact checklist to implement.
