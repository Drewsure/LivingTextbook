# ADR 0320: AI Prototype Wrapper Adapter Review Storage Contract

Date: 2026-07-31  
Status: Accepted

## Context

ADR 0319 added the review-only wrapper adapter gate for returned AI-built prototypes. The next foundation requirement is a backend-neutral storage contract so hosted and local deployments can preserve the same adapter-boundary evidence later.

## Decision

Add `ai_prototype_wrapper_adapter_review` / `ai-prototype-wrapper-adapter-review` as a backend-neutral storage category across schema drafts, migration candidates, migration specs, durable record plans, hosted adapter plans, local adapter plans, persistence boundaries, and backend readiness verification.

The record preserves parent-engine adapter boundary, fixture input contract, standard event output contract, state ownership rules, wrapper evidence, rejection triggers, and blocked actions.

## Consequences

- Hosted and closed local deployments can use the same review evidence shape.
- Wrapper adapter records remain admin/review evidence only.
- Event bypass, tenant hard-coding, route ownership, score authority, audio manifest authority, reward inventory writes, support-language progress triggers, direct app imports, package promotion, and assignments remain blocked.
- Future backend vendor selection can compare support for this record without changing the product architecture.
