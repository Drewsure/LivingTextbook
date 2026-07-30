# DR-297: AI Reward Readiness Gate

Status: Accepted  
Date: 2026-07-31

Decision: Add a review-only reward readiness gate for AI-generated game packages.

White-label impact: Strongly positive. Tenants can define reward names and visual themes while the platform preserves a universal child-safe mastery economy.

Cost impact: Positive. The gate blocks inventory writes, reward publishing, ticket issuance, avatar evolution, and assignment work until generated content is valid and reviewed.

Constraints:

- Preserve the 1,000 Star Dust unit cap and 75% mastery thresholds.
- Preserve deterministic collection unlock bindings and accepted learning-event sources.
- Block generated surprise rewards, random/gacha mechanics, media-only Star Dust, and support-language-only mastery.
- Require correction-queue clearance before rewards can move toward student use.
- This decision is recorded in `docs/adr/0297-ai-reward-readiness-gate.md`.
