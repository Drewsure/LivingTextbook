# ADR 0328: AI Prototype Mobile Accessibility Storage Contract

## Status

Accepted

## Context

The review-only mobile/accessibility report makes returned prototype risks visible in generator routes. The same evidence must also have a backend-neutral storage contract before any hosted or closed local pilot can treat that report as durable. Otherwise a polished prototype could move toward integration without preserving the mobile viewport, touch target, focus, readable text, or wrapper-control proof that teachers and reviewers need.

This is especially important for Phaser and canvas prototypes, because their visuals can hide DOM labels, focus order, control text, and parent-engine event boundaries.

## Decision

Add a backend-neutral `ai_prototype_mobile_accessibility_report` / `ai-prototype-mobile-accessibility-report` storage contract across schema draft, migration candidates, migration specs, durable records, persistence adapter plans, and route verification.

The contract preserves activity compatibility snapshot id, template rendering profile id, font accessibility profile id, standard event contract id, viewport evidence, touch target checks, keyboard/focus checks, readable text checks, visual stability checks, wrapper control checks, failure triggers, and blocked actions.

## Consequences

- Returned prototypes cannot claim mobile, wrapper, route, package, promotion, or assignment readiness without durable mobile/accessibility evidence.
- Hosted and closed local deployments use the same record shape.
- Accessibility waivers, student-facing previews, direct app imports, route registry writes, package promotion, and assignments remain blocked.
- Phaser and canvas wrappers must preserve accessible control evidence before apps/web integration can be considered.
- MiniStar early Japanese support text remains hiragana-readable and support-only.
