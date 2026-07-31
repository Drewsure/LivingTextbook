# DR-313: AI Generated Game Build Brief Packet

Date: 2026-07-31

## Decision

Expose review-only AI generated game build brief packets on teacher generator routes.

## Rationale

Outside AI builders can help prototype games, but they need strict instructions. A build brief converts generator records into mode-level instructions that preserve parent engines, JSON fixtures, audio rules, deterministic scoring, standard events, deliverables, and blocked shortcuts.

## Hard Boundaries

- No standalone game promotion.
- No Phaser bypass without parent-engine wrapper.
- No generated game route write.
- No scoring profile override.
- No student assignment from build brief.
- No media-only progress shortcut.
- No Japanese support-language scoring or release for MiniStar.

## Required Brief Sections

- Target mode and parent engine.
- JSON fixture shape.
- `standard_event_contract`.
- `audio_cue_manifest`.
- Deterministic scoring contract.
- Integration notes.
- Deliverables.
- Blocked actions.

## White-Label Impact

This lets MiniStar and future tenants use low-cost external prototype help without letting those prototypes define the architecture. Phaser and premium visuals remain possible, but the LivingTextbook platform keeps schema, events, scoring, audio, and release-control authority.
