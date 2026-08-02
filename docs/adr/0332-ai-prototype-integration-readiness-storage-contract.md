# ADR 0332: AI Prototype Integration Readiness Storage Contract

## Status

Accepted

## Context

The review-only AI prototype integration readiness gate now rolls up wrapper, fixture, event, audio, mobile, scoring, and Codex decision evidence before any returned prototype can move toward app integration.

That visible gate also needs a backend-neutral storage contract. Without durable hosted and closed-local records, a future pilot could lose the evidence chain or treat UI state as enough to approve an `apps/web` patch, route write, scoring mutation, Star Dust or reward write, package promotion, or student assignment.

## Decision

Add `ai_prototype_integration_readiness_gate` / `ai-prototype-integration-readiness-gate` across schema draft, migration candidates, migration specs, durable records, persistence adapter plans, content-model guard rules, and route verification.

The contract preserves linked integration plan, wrapper adapter review, fixture replay report, event replay report, audio coverage report, mobile accessibility report, scoring replay report, Codex integration review decision, evidence readiness checks, all-evidence-reviewed state, and blocked actions.

## Consequences

- Hosted and closed-local deployments can store the same readiness gate shape.
- Returned prototypes cannot claim all-evidence-reviewed, Codex-reviewed, app-patch, route, scoring, reward, package promotion, or assignment readiness from UI-only state.
- App patches, direct imports, route writes, student-facing routes, scoring mutations, Star Dust or reward writes, audio manifest mutation, package promotion, and assignments remain blocked.
- MiniStar Japanese support remains support-only and hiragana-safe for early levels; English remains the target-language trigger.
