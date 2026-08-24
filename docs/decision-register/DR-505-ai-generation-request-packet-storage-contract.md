# DR-505: AI Generation Request Packet Storage Contract

Status: Accepted

Date: 2026-08-25

## Decision

AI generation request packets must have backend-neutral hosted and local storage contracts before live AI generation, model billing, draft generation, verifier submission, route creation, playlist creation, package assembly, student assignment, or support-language progress workflows can exist.

## Rationale

The teacher generator is moving toward a powerful workflow, but the foundation must remain review-first and cost-gated. A visible request storage guard is not enough on its own. The platform needs a durable root packet that preserves request-builder review, source evidence, premium AI cost gate, target-language audio coverage, activity compatibility, media rights, teacher draft, and verifier submission links.

This keeps the white-label product safe for schools and publishers while still preparing for hosted, installed PWA, desktop, and local classroom deployments.

## Constraints

- Request packets are metadata and evidence records, not live prompt dispatches.
- Raw learner audio, learner transcripts, and unreviewed source payloads stay out of core storage.
- Support-language text, audio, taps, or media can never unlock progress.
- Hosted and local adapters must preserve the same vocabulary and blocked actions.
- Future live model calls and billing require explicit premium entitlement and school or tenant approval.

## Verification

- `npm run verify:backend-storage`
- `npm run verify:ai-generator`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web`
- `npm run verify:routes`
