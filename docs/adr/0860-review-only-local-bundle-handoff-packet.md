# ADR 0860: Review-Only Local Bundle Handoff Packet

## Status

Accepted for foundation rehearsal.

## Context

The local companion preview now has separate manifest, route, asset, release,
and deployment evidence. Future package work needs one stable contract that
assembles those findings without becoming an export or activation workflow.

## Decision

Add a provider-neutral, tenant- and bundle-identified handoff packet with
required checks and explicit blocked actions. Keep offline readiness fail-closed
when any required check is open or blocked.

## Boundaries

The packet is pure review evidence. It does not read files, write packages,
upload media, create installers, mutate redirects, activate offline mode, or
promote a student-facing route.

## Consequences

Future local shells and exporters have one contract to consume, while the
current preview remains honest about unresolved evidence and side effects.
