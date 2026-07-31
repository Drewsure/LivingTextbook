# DR-319: AI Prototype Wrapper Adapter Review

Date: 2026-07-31  
Status: Accepted

## Decision

Returned AI-built game prototypes must pass a wrapper adapter review before they can move toward integration. The review is visible on `/teacher/generator/sample-publisher` and `/teacher/generator/ministar`.

## Rationale

Outside prototypes can accelerate game development, especially for Phaser or speech/gameplay-heavy surfaces. The platform still needs one clear owner for routing, scoring, audio manifests, mastery, rewards, tenant configuration, assignment state, and student safety. A wrapper adapter review protects that boundary while keeping prototype experimentation open.

## Hard Boundaries

- No direct app import.
- No route registry write.
- No event contract bypass.
- No scoring profile mutation.
- No audio manifest mutation.
- No tenant hard-coding.
- No package promotion.
- No student assignment.
- No support-language progress trigger.

## White-Label Impact

This keeps generated or outsourced games portable across tenants. MiniStar can use Cloud Dog, Star Kid, English audio, and hiragana-only Japanese support rules, while another publisher can use different branding, target language, media, and support-language rules without changing the parent-engine contract.
