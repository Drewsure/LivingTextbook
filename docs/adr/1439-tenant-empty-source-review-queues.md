# ADR 1439: Tenant-Empty Source Review Queues

## Status

Accepted

## Decision

Reference tenants may display their own reviewed sample source fixtures. Every
other white-label tenant receives an explicitly empty source-review queue and
empty extraction packet and preview collections.

The route must choose this state before the workspace component renders. The
component may still filter records defensively, but filtering is not the
tenant-isolation contract.

## Consequences

- A new publisher sees the review workflow without inheriting MiniStar or
  sample-publisher records.
- Required review rules remain visible without fabricating source evidence.
- No source extraction, package assembly, QR release, persistence, or student
  activation is enabled by creating the empty workspace.
- Reference fixtures remain useful for the two maintained demonstrations.

## Verification

`npm run verify:source-review-queue` must check the route-level reference
tenant gate, empty queue factory, and withheld extraction collections.
