# ADR 0209: Activity Compatibility Snapshot Storage Contract

Date: 2026-07-14

## Status

Accepted

## Context

The platform intentionally avoids a giant switch-to-anything panel. Instead, teachers should see curated activity pathways per unit, with extra conversions added only when compatibility rules prove they are safe.

The content-entry scaffold and template rendering profiles already reference `activity_compatibility_snapshot`, but the record was not yet part of the backend-neutral storage contract.

## Decision

Add `activity_compatibility_snapshot` as a durable backend-neutral contract.

The record preserves payload shape, allowed activity modes, blocked conversions, target-language trigger policy, printable output policy, and student-facing pathway blocks. Hosted and local adapter plans must both support it.

## Consequences

Future teacher pathway changes, extra template conversions, and printable switching must use reviewed compatibility snapshots. Support-language progress triggers, unchecked conversions, media-only mastery paths, and switch-to-anything behavior remain blocked.

