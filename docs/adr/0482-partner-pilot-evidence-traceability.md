# ADR 0482: Partner Pilot Evidence Traceability

Status: Accepted

## Context

The partner pilot requirements route shows what a publisher or school must supply or decide before a real classroom pilot. The next foundation need is traceability: each requirement should point to the review route that holds the relevant proof or blocker, so a pilot meeting does not become disconnected from source, media, policy, reporting, deployment, entitlement, and game-readiness gates.

## Decision

Add an evidence traceability map to `/teacher/pilot/requirements/[tenantId]`.

Each trace item includes:

- Requirement link.
- Evidence route.
- Current signal.
- Blocked-until condition.
- Pilot dependency.
- Review-only status.

## Consequences

- Partner discussions can see demo evidence and classroom blockers in one place.
- Hosted PWA remains the recommended first pilot path unless a partner requires a gated local path.
- Optional premium AI Tutor and Z.ai prototype paths stay visible without activating them.
- The route remains a planning and evidence map, not a live upload, policy, storage, report, billing, prototype, or launch workflow.

## Verification

- `npm run verify:pilot-requirements`
- `npm run verify:routes`
- `npm run verify:foundation`
