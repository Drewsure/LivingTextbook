# ADR 0336: AI Generator Route Map

## Status

Accepted

## Context

The teacher generator route has grown from a simple preview into a full admin review surface covering request setup, prompt/cost controls, prototype review, integration gates, package review, and draft repair.

Without a stable route map, future panels can make the surface hard to scan and easier to misuse. The platform needs navigation structure before adding more review lanes.

## Decision

Add a generator route map to teacher generator routes. The map links to Request setup, Prototype review, Integration gates, Package review, and Draft repair sections.

The map is structural only. It does not enable live AI generation, verifier submission, package assembly, route creation, playlist creation, student assignment, or app patch generation.

## Consequences

- Teacher/admin generator review becomes easier to scan as the product grows.
- Future agents have named placement zones for generator features.
- Integration and package gates remain visible instead of being buried below long prototype evidence panels.
- This supports white-label partner review without adding backend cost or live workflow behavior.
