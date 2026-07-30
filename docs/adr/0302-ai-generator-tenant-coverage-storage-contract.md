# ADR 0302: AI Generator Tenant Coverage Storage Contract

Status: Accepted  
Date: 2026-07-31

## Decision

Promote `ai_generator_tenant_coverage_gate` / `ai-generator-tenant-coverage-gate` into the backend-neutral storage plan.

The record stores request-specific tenant generator coverage lanes, covered/partial/missing counts, blocked generator actions, and next tenant requirements.

## Rationale

The teacher generator route now shows tenant coverage, but the rule must not remain UI-only. Hosted and closed local deployments need the same durable contract so a sample publisher record cannot make MiniStar appear ready, and an optional AI Tutor request cannot become active through a generic generator route.

## Consequences

- Backend schema, migration candidates, migration specs, durable records, and persistence adapter plans now name the tenant coverage gate.
- Hosted and local adapters must preserve tenant-specific covered, partial, and missing generator record lanes.
- Generator request submission, live model calls, verifier submission, package assembly, route registry writes, media playlist writes, assignment creation, local bundle writes, and student-ready markers remain blocked.
- `npm run verify:backend-storage` checks the storage contract.
