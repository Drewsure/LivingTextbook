# DR-1138: Evidence Attachment Storage Handoff Binding

## Decision

Bind evidence attachment storage readiness into the tenant evidence handoff as
a provider-neutral, blocked review record.

## Rationale

The platform already described storage candidates and selection policy, but the
handoff did not carry that decision scope. Binding it now makes hosted,
closed-local, and hybrid deployment duties visible without accidentally
activating storage.

## Guardrails

- Tenant, package, readiness-plan, selection-gate, candidate, metadata, policy,
  and blocked-action identity must remain together.
- Storage activation, upload, download, signed URL, archive migration, and
  release mutation remain false.
- Provider selection remains a separate governed decision.

## Evidence

The shared storage handoff validator, sample package binding, handoff panel,
route verifier, and full foundation gate provide the implementation evidence.
