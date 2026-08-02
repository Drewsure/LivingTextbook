# DR-334: Codex Integration Review Decision Storage Contract

## Decision

The platform will store Codex integration review decisions as a backend-neutral contract before any returned AI prototype can claim integration approval or move toward app patch planning.

## Rationale

The review-only decision preview is useful, but future hosted and closed-local pilots need the decision to be durable, exportable, auditable, and separate from UI state. This keeps outside prototype work productive without letting it bypass parent-engine, scoring, audio, reward, route, package, assignment, or white-label boundaries.

## Implementation Notes

- Backend schema entity: `codex_integration_review_decision`.
- Durable record category: `codex-integration-review-decision`.
- Hosted write intent: `hosted-codex-integration-review-decision-write`.
- Local write intent: `local-codex-integration-review-decision-write`.
- The record preserves linked integration plan, readiness gate, selected decision, decision status, manual Codex review requirement, all-evidence-reviewed state, decision evidence checks, and blocked actions.
- App patch generation, direct imports, route registry writes, student-facing routes, scoring profile mutations, Star Dust or reward writes, audio manifest mutations, package promotion, and assignments remain blocked.

## Follow-Up

Do not build live decision capture until reviewer identity/signature policy, evidence attachment storage, release-control binding, and package promotion gates are accepted.
