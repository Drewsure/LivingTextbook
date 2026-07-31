# DR-320: AI Prototype Wrapper Adapter Review Storage Contract

Date: 2026-07-31  
Status: Accepted

## Decision

The platform will preserve `ai_prototype_wrapper_adapter_review` / `ai-prototype-wrapper-adapter-review` as a backend-neutral storage contract before returned prototypes can move from review evidence toward parent-engine wrapper integration.

## Rationale

The white-label product needs a consistent way to store adapter-boundary review evidence for both hosted pilots and closed local deployments. Without this, prototype decisions could become informal and hard to audit, especially when outside builders return Phaser or speech-heavy work.

## Required Evidence

- Parent-engine adapter boundary.
- Fixture input contract.
- Standard event output contract.
- State ownership rules.
- Wrapper evidence.
- Rejection triggers.
- Blocked actions.

## Hard Blocks

- No event contract bypass.
- No tenant hard-coding.
- No route state ownership.
- No score authority.
- No audio manifest authority.
- No reward inventory write.
- No support-language progress trigger.
- No direct app import.
- No package promotion.
- No assignment creation.

## White-Label Impact

The same storage category works for MiniStar, sample publishers, and future Japanese-as-target-language tenants. Tenant-specific visuals, mascots, language rules, and media stay injected configuration rather than prototype-owned code.
