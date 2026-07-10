# ADR 0122: Teacher Report Package Boundary

## Status

Accepted

## Context

Teacher session monitor pages now show pilot readiness, media engagement, assigned game/audio coverage, settings, lifecycle controls, and report export readiness. The reporting surface still needed a clearer package boundary for a white-label pilot.

## Decision

Add a derived teacher report package boundary to the teacher session monitor context and render it on teacher session pages.

## Consequences

- Teachers and publishers can see what report exports may include before live export exists.
- Support-only events remain visible without being treated as mastery evidence.
- Sensitive audio, transcript, AI Tutor, note, and identity fields stay outside the core report scaffold.
- Future hosted and local persistence work has a clearer export-package contract to implement.
