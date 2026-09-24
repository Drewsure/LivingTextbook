## Build session 1059: Pilot decision storage identity

- Carried storage-selection preflight and evidence-storage gate identity into
  the canonical pilot review decision.
- Carried the same identity into white-label release-readiness pilot evidence.
- Added fail-closed validation for missing IDs, enabled selection, or drift from
  the blocked provider-neutral state.
- Exposed the identity chain in the pilot decision and release-readiness panels.
- Added focused runtime, behavior, dashboard, and release-readiness checks.
- Recorded ADR 1145 and DR-1145.

The next release-boundary slice must preserve this identity into any durable
record, export preview, approval packet, or future provider-selection work
order. No provider choice or student-facing activation is implied.
