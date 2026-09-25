# DR-1190: Controlled-Pilot Human-Review Evidence Adjudication

## Decision

Record explicit blocked or next-gate-only human review outcomes in a
tenant/package-bound, review-only adjudication record.

## Required identity

The record must preserve decision snapshot, release-review binding,
human-review packet, readiness, tenant, and package identity.

## Guardrail

`accepted-for-next-gate` is not approval. Persistence writes, release mutation,
package promotion, activation, and student launch remain blocked.

## Evidence

The shared model and verifier cover valid blocked/accepted outcomes, cross-
tenant packet rejection, and approval-capture drift rejection.
