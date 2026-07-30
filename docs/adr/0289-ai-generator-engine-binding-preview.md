# ADR 0289: AI Generator Engine Binding Preview

Status: Accepted  
Date: 2026-07-31

## Decision

Add a review-only engine binding preview to `/teacher/generator/sample-publisher`.

Generated activity proposals must bind to the existing game mode catalog, parent engines, scoring profiles, and standard event contract before they can move toward package review.

## Rationale

The product should feel rich, but it must not become a pile of isolated generated games. Engine binding keeps build cost controlled, keeps Z.ai/prototype work disciplined, and preserves the four-parent-engine architecture.

## Consequences

- Generated drafts must name `ai_engine_binding_plan`, `game_mode_catalog_snapshot`, `engine_mode_config_binding`, `scoring_profile_binding`, and `standard_event_contract` records.
- Standalone generated game code, parent-engine bypass, unmapped modes, and unreviewed scoring overrides remain blocked.
- Phaser or premium skins can be explored later, but must wrap the parent-engine contract.
