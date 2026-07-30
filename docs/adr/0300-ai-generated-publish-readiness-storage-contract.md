# ADR 0300: AI Generated Publish Readiness Storage Contract

Status: Accepted  
Date: 2026-07-31

## Decision

Promote `ai_generated_publish_readiness_gate` / `ai-generated-publish-readiness-gate` into the backend-neutral storage plan.

The record stores correction queue clearance, verifier packet approval, manifest completeness, reward readiness, release-control binding, teacher approval ledger capture, blocked publish actions, and next publish records.

## Rationale

The generator route now shows a publish readiness gate. That gate must not stay UI-only if it will later control generated route creation, route registry writes, playlist creation, assignments, local bundle writes, or student-ready markers. Hosted and local deployments need the same durable contract before backend selection.

## Consequences

- Backend schema, migration candidates, migration specs, durable records, and persistence adapter plans now name the generated publish readiness gate.
- Hosted and local adapters must preserve correction, verifier, manifest, reward, release-control, and approval requirements.
- Generated route creation, route registry writes, media playlist writes, assignment creation, local bundle writes, and student-ready markers remain blocked.
- `npm run verify:backend-storage` checks the storage contract.
