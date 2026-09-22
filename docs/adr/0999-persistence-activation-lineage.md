# ADR 0999: Persistence Activation Lineage

## Status

Accepted for the review-only foundation.

## Decision

Pilot handoff activation evidence must reference the exact deployment decision,
school-policy acceptance preflight, and future acceptance-record preview for its
tenant and package. It must also preserve the deployment selection status and
the policy's `not-accepted` status.

## Consequences

- Hosted and local adapters receive one explicit policy/deployment lineage.
- Generic environment flags cannot be treated as complete pilot approval.
- The handoff remains useful for partner review without creating a write path.

## Explicitly blocked

This decision does not activate persistence, accept policy, select a provider,
launch a classroom, export reports, mutate QR routes, or promote a package.
