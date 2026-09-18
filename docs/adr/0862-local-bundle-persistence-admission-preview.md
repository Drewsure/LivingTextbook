# ADR 0862: Local Bundle Persistence Admission Preview

## Status

Accepted for foundation rehearsal.

## Context

Local bundle handoff evidence and the provider-neutral persistence handoff are
separate contracts. Without a typed bridge, a future adapter could store a
local package record without proving tenant identity, shared category
coverage, or the package-side safety blockers.

## Decision

Add a review-only local bundle persistence admission preview. It joins the
local handoff packet to the shared persistence handoff packet and requires
coverage for the `local-companion-handoff` record. The preview keeps provider
selection null and all durable write, package write, offline activation,
student promotion, and hosted redirect mutation flags false.

## Boundaries

The preview is evidence, not an adapter. It does not open a database, write a
record, export a package, activate offline delivery, or promote a student
route.

## Consequences

Future hosted and local adapters receive one explicit admission shape, and
missing tenant-bound local deployment coverage fails before implementation
work can proceed.
