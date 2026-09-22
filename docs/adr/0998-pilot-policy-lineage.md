# ADR 0998: Pilot Policy Lineage

## Status

Accepted for the review-only foundation.

## Decision

The pilot deployment decision must explicitly reference the tenant school-policy
acceptance preflight and the future acceptance-record preview. A deployment
recommendation is not a policy acceptance and cannot authorize live behavior.

## Consequences

- Policy evidence can be traced from the pilot deployment board to the existing
  school-policy review artifacts.
- The sample remains `not-accepted` and side-effect free.
- Future hosted and local adapters have stable policy lineage to enforce.
- A real acceptance workflow still requires authenticated identity, versioned
  policy text, retention/export/deletion terms, revocation, and release control.

## Explicitly blocked

This decision does not add an accept button, signature capture, persistence
activation, classroom launch, report export, QR mutation, package promotion, or
provider migration.
