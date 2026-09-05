# ADR 0483: Partner Pilot Meeting Agenda

Status: Accepted

## Context

The partner pilot requirements route and evidence traceability map show what is needed before a real pilot. The next practical gap is the first meeting sequence: what to ask, what evidence to request, and what decisions must not be made inside a review-only route.

## Decision

Add a typed first partner pilot meeting agenda to `/teacher/pilot/requirements/[tenantId]`.

The agenda includes:

- Source package questions.
- Multimedia and rights questions.
- Curated activity pathway questions.
- QR, entry, and learner-code questions.
- Policy, reporting, and deployment questions.
- Optional premium AI and outside prototype timing questions.
- Evidence requests.
- Decisions not made here.
- Live workflow blocks.

## Consequences

- Partner discovery becomes repeatable and white-label friendly.
- Demo evidence remains clearly separate from classroom launch approval.
- Hosted PWA stays the recommended first pilot path for cost control.
- Live upload, policy, storage, reporting, premium AI, prototype, local package, and classroom launch workflows remain blocked until their foundation gates are ready.

## Verification

- `npm run verify:pilot-requirements`
- `npm run verify:routes`
- `npm run verify:foundation`
