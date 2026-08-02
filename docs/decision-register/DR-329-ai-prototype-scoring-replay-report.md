# DR-329: AI Prototype Scoring Replay Report

## Decision

The platform will require a review-only AI prototype scoring replay report before returned prototypes can continue toward integration review.

## Rationale

Game prototypes must not become scoring systems by accident. Star Dust, mastery, collection unlocks, reward boundaries, and accepted progress effects are central platform contracts, especially for white-label deployments where tenants may have different reward skins but the safety logic must remain stable.

## Implementation Notes

- Generator routes expose the report for sample publisher and MiniStar tenants.
- Reports reference `prototype_scoring_replay_report`, `game_scoring_profile_snapshot`, `progress_event_acceptance_map`, `collection_unlock_binding`, and `standard_event_contract`.
- Required checks include deterministic scoring replay, score inputs, mastery replay checks, reward boundary checks, and mode-level failure triggers.
- Blocked actions include scoring profile mutation, direct score authority, Star Dust writes, reward inventory writes, random reward generation, media-only Star Dust, support-language-only mastery, package promotion, and student assignment.
- MiniStar reports keep Japanese support-language scoring and release blocked while English remains the target-language trigger.

## Follow-Up

Add a backend-neutral storage contract for `prototype_scoring_replay_report` after this review surface is verified.
