# DR-1400: Bound Source Preflight Intake Sidecars

## Decision

Treat only the publisher pilot intake brief, kit README, and `evidence/`
subtree as known source-preflight sidecars. Keep every other undeclared file
as an inventory blocker.

## Boundary

This is a scan classification rule, not approval. Rights, accessibility,
package, release, QR, persistence, and student gates remain independent.

## Verification

The source preflight verifier retains its unlisted-file fixture, and the pilot
bridge self-test runs a complete kit through the real preflight.
