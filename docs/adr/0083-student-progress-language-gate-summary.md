# ADR 0083: Student Progress Language Gate Summary

## Status

Accepted

## Context

Target-language listening drives the entry gate. Support-language taps may support comprehension, but must not unlock progression. The teacher report summary now displays this distinction; the student progress summary should do the same.

## Decision

Add English listened and support unlock metrics to `UnitSessionProgressSummary`.

## Consequences

Students get clearer feedback about why the next activity unlocks. The rule remains deterministic and does not add backend storage or new scoring.
