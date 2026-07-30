# DR-288: AI Generator Gamification Mapping Preview

Status: Accepted  
Date: 2026-07-31

Decision: Add a review-only AI gamification mapping preview to `/teacher/generator/sample-publisher`.

White-label impact: Strongly positive. Tenants can configure reward names and catalogs while preserving deterministic event-driven progression.

Cost impact: Positive. Deterministic scoring avoids expensive adaptive reward systems and blocks risky random-pressure mechanics.

Constraints:

- Generated games must name accepted events, scoring lanes, mastery thresholds, and collection unlock bindings before review.
- Support-language-only mastery and media-only Star Dust remain blocked.
- Random reward generation, generated gacha, and purchase-like unlocks remain blocked.
- This decision is recorded in `docs/adr/0288-ai-generator-gamification-mapping-preview.md`.
