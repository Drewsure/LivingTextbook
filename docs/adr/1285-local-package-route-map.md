# ADR 1285: Identity-Bound Local Package Route Map

Date: 2026-09-30
Status: Accepted

## Decision

The closed-local companion derives its front door, Memory Match handoff,
teacher evidence view, and media route paths from one approved package runtime
identity and one registered unit route. The route map is a reusable server-side
contract consumed by local package pages; individual pages must not reconstruct
package paths independently.

The route map preserves the QR-recorded local fallback path, derives a stable
local launch code, and rejects missing unit registrations or unsafe unit
identities. It is metadata-only: creating the map does not activate a package,
write progress, mutate a QR alias, or enable hosted persistence.

## Rationale

The first saleable white-label pilot needs a publisher-readable chain from
printed QR identity to the reviewed unit, the first activity, the canonical
game handoff, and teacher evidence. Shared path construction prevents a local
companion from drifting between front-door, game, media, and reporting routes as
the package evolves.

## Verification

The local package behavior harness assembles an approved temporary fixture and
proves the route map produces the expected front-door, Memory Match, teacher
evidence, and fallback paths. It also proves missing and traversal unit ids are
blocked. The fixture is removed after the rehearsal.

## Boundaries

- Frozen Z.ai/Phaser source remains outside the route map and integration path.
- A route map is not release approval, QR print authorization, or classroom launch.
- Local routes remain gated by approved runtime metadata and content.
- Learner records remain excluded from local package metadata.
