# ADR-0518: Audio Cue Identity Integrity

Status: Accepted

## Context

Audio support plans reference cues by ID. If a package contains the same ID more than once, a consumer can resolve a different text, language, or source depending on iteration order.

## Decision

Reject duplicate audio cue IDs during shared content-package validation before any plan or runtime adapter can treat the package as ready.

## Consequences

- Cue resolution is deterministic and auditable.
- Package importers and future AI/provider adapters must repair identity collisions before release.
- No provider, storage, route, or student-state side effect is introduced.
