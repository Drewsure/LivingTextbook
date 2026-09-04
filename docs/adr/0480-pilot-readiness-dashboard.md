# ADR 0480: Pilot Readiness Dashboard

Status: Accepted

## Context

The foundation now contains separate surfaces for deployment, policy, persistence, source evidence, media, launch gates, report readiness, package publish gates, and white-label partner demos. Those surfaces are useful, but they are too scattered for a first partner or school readiness conversation.

## Decision

Create `/teacher/pilot` as a focused review-only pilot readiness dashboard. The route summarizes what is demo-ready and what remains blocked before classroom launch, while linking to the underlying evidence routes.

## Consequences

- Partner conversations get one clear command view.
- Demo-ready and classroom-ready remain separate states.
- Hosted PWA remains the preferred first pilot recommendation for cost control unless a partner requires closed local operation.
- The page cannot launch a class, collect learner data, export reports, accept policy, activate a local package, claim offline readiness, enable premium AI Tutor, or request Z.ai intake.

## Verification

- `npm run verify:pilot`
- `npm run verify:routes`
- `npm run verify:foundation`
