# DR-317: AI Prototype Integration Plan

Date: 2026-07-31

## Decision

Expose review-only AI prototype integration plans after prototype return review.

## Rationale

Returned prototype work should have a visible path toward integration, but the path must be wrapper-first. The platform should require fixture replay, event replay, audio coverage, deterministic scoring replay, mobile accessibility inspection, white-label checks, and Codex decision before any returned code can affect the app.

## Hard Boundaries

- No direct import into `apps/web`.
- No route registry write.
- No game sequence mutation.
- No scoring profile mutation.
- No audio manifest mutation.
- No package promotion.
- No student assignment.
- No prototype evidence treated as package-ready.

## White-Label Impact

This keeps prototype work portable across MiniStar and future tenants. A strong game surface can become a candidate wrapper, but tenant content, branding, audio, scoring, and release rules remain configurable and reviewed.
