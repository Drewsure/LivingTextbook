# ADR 0174: Collection Ownership Provenance Preview

Date: 2026-07-13

## Status

Accepted

## Context

The collection room showed deterministic reward thresholds, and the backend contract now defines collection inventory storage. The visible route also needs to show how ownership will be connected to accepted learning events before storage is enabled.

## Decision

Add an ownership provenance preview to the collection room. The preview lists owned collection items, unlock source events, deterministic mastery rule snapshots, and policy-gated storage readiness.

## Consequences

The collection route now demonstrates the bridge from reward catalog to future inventory records without enabling real persistence. Route verification requires the provenance language so future polish cannot remove the storage boundary silently.
