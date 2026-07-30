# ADR 0288: AI Generator Gamification Mapping Preview

Status: Accepted  
Date: 2026-07-31

## Decision

Add a review-only AI gamification mapping preview to the teacher generator route.

The mapping names accepted game events, Star Dust allocation, mastery thresholds, collection unlock bindings, score-profile snapshots, and blocked reward shortcuts before any generated game draft can move toward review.

## Rationale

The platform depends on a transparent mastery loop. AI-generated games must not invent scoring behavior, random rewards, support-language mastery, or media-only progress. A visible mapping gives teachers, partners, and future verifiers a stable way to inspect gamification before student use.

## Consequences

- Generated packages must name `ai_gamification_mapping_plan`, `game_scoring_profile_snapshot`, `progress_event_acceptance_map`, and `collection_unlock_binding` records.
- Random reward generation, generated gacha, purchase-like unlocks, media-only Star Dust, and support-language-only mastery remain blocked.
- Collection ownership remains tied to deterministic accepted events.
