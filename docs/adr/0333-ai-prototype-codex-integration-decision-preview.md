# ADR 0333: AI Prototype Codex Integration Decision Preview

## Status

Accepted

## Context

The prototype readiness gate depends on a future `codex_integration_review_decision`. Without a visible decision preview, future agents could mistake completed evidence reports for approval to patch `apps/web` or expose student-facing routes.

External prototype work must stay useful without becoming a shortcut around architecture, accessibility, scoring, audio, reward, tenant, and release-control rules.

## Decision

Add a review-only Codex integration decision preview to teacher generator routes. The preview shows required evidence, disabled decision options, no-decision-recorded state, and blocked actions before any prototype can move toward app integration.

The preview blocks app patch generation, direct imports, route registry writes, student-facing routes, scoring mutations, Star Dust or reward writes, audio manifest mutations, package promotion, and assignment.

## Consequences

- Evidence reports and readiness gates no longer imply integration approval by themselves.
- Codex remains the final integration reviewer before any app patch is proposed.
- Z.ai and other outside builders can keep producing prototypes while the LivingTextbook parent-engine boundary remains protected.
- MiniStar Japanese support remains support-only and hiragana-safe for early levels; English remains the target-language trigger.
