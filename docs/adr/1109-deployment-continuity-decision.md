# ADR 1109: Deployment Continuity Decision

Status: Accepted for the review-only deployment workbench

## Decision

Bind the hosted PWA, local classroom server, and packaged textbook companion
choices to the shared persistence recovery rehearsal. Every path exposes its
recovery modes, continuity blockers, and evidence bindings for the same tenant
and package.

The packet keeps recommendations separate from selection. Policy acceptance,
provider selection, persistence activation, classroom launch, offline-ready
status, installer export, and route mutation remain disabled.

## Rationale

White-label publishers need a credible product path across deployment models,
but each model carries different operational and recovery obligations. A shared
continuity decision makes those obligations visible without creating a second
release or deployment workflow.

## Consequences

- Commercial conversations can compare paths using the same evidence language.
- Later provider-specific work orders inherit continuity blockers rather than
  bypassing them.
- No recommendation can be mistaken for a production-ready deployment.

## References

- `packages/content-model/src/deploymentContinuityDecision.ts`
- `apps/web/src/features/deployment/DeploymentContinuityDecisionPanel.tsx`
- `docs/verification/CONTENT_INTAKE_CHECKS.md`
