# ADR 0294: AI Generator Cost Entitlement Gate

Status: Accepted  
Date: 2026-07-31

## Decision

Add a review-only AI generator cost and entitlement gate to `/teacher/generator/sample-publisher`.

The gate names `premium_ai_cost_gate`, `tenant_ai_generation_entitlement`, `usage_budget_ceiling`, `model_rate_card_snapshot`, `voice_generation_separate_package`, `cost_estimate_preview`, and `school_approval_required` before any live AI generation is enabled.

## Rationale

AI generation is a saleable white-label feature, but it creates recurring API cost and school policy responsibilities. The product must expose the commercial gate early while keeping live prompt dispatch, model billing, voice generation, speech scoring, AI Tutor activation, and teacher self-enablement blocked.

## Consequences

- Teachers can review the future cost and entitlement shape, but cannot enable AI generation from the scaffold.
- Synthetic voice generation and speech scoring remain separate premium packages.
- AI Tutor remains optional and premium-gated.
- Children never see premium upsell copy or trigger AI spending.
- `npm run verify:ai-generator` checks the gate.
