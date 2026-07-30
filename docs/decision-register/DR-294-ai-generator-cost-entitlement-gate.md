# DR-294: AI Generator Cost Entitlement Gate

Status: Accepted  
Date: 2026-07-31

Decision: Add a review-only AI generator cost and entitlement gate to the teacher/admin generator route.

White-label impact: Strongly positive. AI generation can become a premium tenant package without making the core platform depend on API spending.

Cost impact: Strongly positive. The gate requires entitlement, school approval, usage budget ceilings, model rate-card snapshots, and package separation before any live model billing exists.

Constraints:

- The gate must name `premium_ai_cost_gate`, `tenant_ai_generation_entitlement`, `usage_budget_ceiling`, `model_rate_card_snapshot`, `voice_generation_separate_package`, `cost_estimate_preview`, and `school_approval_required`.
- Teachers cannot self-enable premium AI.
- Voice generation, speech scoring, and AI Tutor remain separate premium paths.
- Children cannot trigger AI spending or see premium upsell copy.
- This decision is recorded in `docs/adr/0294-ai-generator-cost-entitlement-gate.md`.
