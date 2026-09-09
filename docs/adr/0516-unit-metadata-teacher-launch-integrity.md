# ADR-0516: Unit Metadata And Teacher Launch Integrity

Status: Accepted

## Context

The unit payload drives multiple foundation boundaries. A structurally valid vocabulary payload can still produce broken routing, game selection, audio mapping, or teacher onboarding when its metadata or launch protocol is empty.

## Decision

Validate unit identity, theme, game identifiers, visual focus, and teacher launch protocol copy in the shared content model before a unit is treated as reviewable.

The compiled behavior harness covers invalid identity, missing theme/engine fields, missing visual fields, and incomplete launch copy.

## Consequences

- Imported, authored, and generated units receive the same minimum operational structure.
- The validator remains independent of a particular game engine, mascot, provider, or tenant brand.
- Z.ai/Phaser work remains deferred until these input contracts are satisfied.
