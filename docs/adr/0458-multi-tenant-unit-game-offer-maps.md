# ADR 0458: Multi-Tenant Unit Game Offer Maps

Status: Accepted

Date: 2026-08-31

## Context

The game-readiness workbench previously showed one sample publisher unit game offer map. That proved the shape of the map, but it did not visibly prove the white-label requirement that MiniStar and partner tenants use the same reviewed game-offer machinery.

## Decision

Expose both the MiniStar flagship unit map and the sample publisher unit map through the same `UnitGameOfferMapPanel` and the same `sampleUnitGameOfferMaps` list.

## Consequences

- MiniStar remains the reference curriculum without becoming a hard-coded platform assumption.
- Partner packages prove they can maintain yearly game offerings through the same contract.
- Future game-mode work should add tenant-specific offers by extending the shared map shape, not by building one-off routes or panels.
- Verifiers must guard the MiniStar package binding, the sample publisher package binding, and the multi-tenant export.

## Still Blocked

- No live game publishing.
- No direct Z.ai prototype import.
- No unrestricted switch-template behavior.
- No student-facing game offer without reviewed audio, route, scoring, and teacher-control evidence.
