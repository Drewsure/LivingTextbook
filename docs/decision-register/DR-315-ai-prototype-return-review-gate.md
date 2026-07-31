# DR-315: AI Prototype Return Review Gate

Date: 2026-07-31

## Decision

Expose a review-only AI prototype return review gate on teacher generator routes.

## Rationale

External prototype builders can accelerate game exploration, but returned code must not become product by accident. The return review gate makes each returned prototype prove wrapper fit, JSON fixture conformance, event replay, audio coverage, deterministic scoring, mobile accessibility, and white-label fit before Codex considers integration.

## Hard Boundaries

- No production merge from returned prototype.
- No route registry write.
- No scoring profile mutation.
- No audio manifest mutation.
- No assignment creation.
- No student-facing preview from returned code.
- No Phaser bypass.
- No support-language-only scoring or release.

## White-Label Impact

The gate makes outside prototype help portable across tenants. MiniStar can receive game prototypes without hard-coding MiniStar behavior into the platform, and partner publishers can use the same review standard for their own content packages.
