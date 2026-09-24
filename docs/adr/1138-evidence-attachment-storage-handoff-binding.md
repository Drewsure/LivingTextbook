# ADR 1138: Evidence Attachment Storage Handoff Binding

## Status

Accepted for foundation preview.

## Decision

Carry the existing evidence attachment storage readiness plan and storage
adapter selection gate into the tenant evidence handoff through one typed,
provider-neutral binding. The handoff must preserve the exact tenant, package,
plan, selection-gate, candidate, metadata, policy, and blocked-action scope.

## Boundaries

The binding is review evidence only. It cannot select a provider, create a
bucket or folder, generate a URL, upload or download an attachment, start a
retention clock, migrate an archive, mutate release state, or expose student
content. Hosted, closed-local, and hybrid paths must use the same blocked
vocabulary.

## Verification

The shared content-model validator, evidence handoff verifier, active route
checks, typechecks, production build, and full foundation gate verify this
connection.
