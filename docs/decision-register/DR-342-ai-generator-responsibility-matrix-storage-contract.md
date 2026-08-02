# DR-342: AI Generator Responsibility Matrix Storage Contract

## Decision

Promote `ai_generator_responsibility_matrix` / `ai-generator-responsibility-matrix` into the backend-neutral storage contract.

## Why

The responsibility matrix is a high-leverage white-label safety boundary. It explains who owns teacher approval, Codex integration, outside AI prototype work, verifier checks, and platform entitlement/storage/release decisions. That map must become durable before it can guide real handoffs.

## Guardrails

- Preserve role ownership, owner duties, handoff records, cannot-do rules, and next gates.
- Preserve target-language trigger and assist-language support-only rules.
- Block external-builder app writes and scoring authority.
- Block live model calls, app patches, generated package assembly, route writes, playlist writes, local bundle writes, assignments, and student-ready markers.

## Verification

- `scripts/verify-backend-storage-readiness.mjs`
- `scripts/verify-active-routes.mjs`
- `npm run verify:foundation`
