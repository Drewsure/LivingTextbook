# DR-716: Launch-Derived Event Tenant Boundary

**Date:** 2026-09-13  
**Status:** Accepted  
**Area:** White-label foundation / canonical progression

## Decision

All local progression events derived from a launch session carry the tenant
identity copied from `LaunchSession.tenantId`. The adapter uses one helper for
entry, unlock, route guidance, launch, media, playlist, and background-media
metadata envelopes.

## Why now

The first canonical game slices already enforce tenant identity at completion.
Leaving surrounding session events unscoped would create an inconsistent
white-label boundary and make future reporting or persistence adapters unsafe
to compose.

## Consequences

- Tenant lineage is consistent across the complete local session evidence
  stream.
- Callers cannot supply a replacement tenant identifier through event metadata.
- This is still review/local evidence only; no live persistence, reports, or
  classroom assignment behavior is enabled.
- The frozen Z.ai/Phaser snapshot remains isolated until contract review and
  promotion approval.
