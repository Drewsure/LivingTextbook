# DR-332: AI Prototype Integration Readiness Storage Contract

## Decision

The platform will preserve AI prototype integration readiness gates as backend-neutral durable records before returned prototypes can claim integration readiness.

## Rationale

Prototype work can move quickly only if the final integration decision is evidence-led. The storage contract keeps wrapper, fixture, event, audio, mobile, scoring, and Codex decision evidence together in hosted and closed-local deployments before any real app patch or student-facing pathway is considered.

## Implementation Notes

- The storage contract is `ai_prototype_integration_readiness_gate` / `ai-prototype-integration-readiness-gate`.
- Schema draft, migration candidates, migration specs, durable records, persistence adapter plans, content-model guard rules, and route verification include the record.
- The record preserves the integration plan id, wrapper adapter review id, fixture replay report id, event replay report id, audio coverage report id, mobile accessibility report id, scoring replay report id, Codex integration review decision id, evidence readiness checks, all-evidence-reviewed state, and blocked actions.
- App patches, direct imports, route registry writes, student-facing routes, scoring profile mutations, Star Dust or reward writes, audio manifest mutations, package promotion, and student assignments remain blocked.
- Hosted and local classroom deployment paths use the same contract shape.

## Follow-Up

Keep the next AI generator foundation step focused on generated package release safety and private tenant library handoff before any generated or returned game becomes student-facing.
