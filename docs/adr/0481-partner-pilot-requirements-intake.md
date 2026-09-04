# ADR 0481: Partner Pilot Requirements Intake

Status: Accepted

## Context

The platform can now show a controlled white-label demo and a pilot readiness dashboard. The next commercial gap is a clear requirements conversation for a textbook partner or school before live uploads, storage, policy acceptance, reports, local package delivery, or classroom launch exist.

## Decision

Create `/teacher/pilot/requirements/[tenantId]` as a tenant-scoped requirements intake. The first active route is `/teacher/pilot/requirements/sample-publisher`.

The intake shows publisher supplies, school decisions, platform evidence, and blocked actions for source PDF/text files, audio, music, video, images, game pathway scope, QR/front-door entry, learner data, reports, deployment, package tier, optional AI Tutor/speech scoring, and outside prototype timing.

## Consequences

- Partner conversations can ask for the right evidence without enabling live upload workflows.
- Hosted PWA remains the recommended first pilot path for cost control.
- Closed local and packaged companion paths remain valid but policy-gated.
- Z.ai or outside prototype intake remains blocked until Codex changes the handoff signal to ready-for-review.
- The route cannot upload files, save answers, accept policy, select storage, export reports, bill premium services, request microphone access, import prototypes, or launch student sessions.

## Verification

- `npm run verify:pilot-requirements`
- `npm run verify:routes`
- `npm run verify:foundation`
