# DR-047: Release Control Adapter Write Intents

Date: 2026-07-09

## Status

Accepted

## Decision

Add package publish gate and package approval ledger write intents to the hosted pilot and local classroom persistence adapter plans.

## Rationale

The durable record map now treats release gates and approval ledgers as first-class records. The adapter handoff must also say how hosted and local storage will write those records. Otherwise a backend could support student events and QR routes but still leave package release control as a manual or static process.

## White-Label Impact

Positive. Publisher, school, and MiniStar packages can share one release-control storage contract while keeping their own owners, policies, and evidence links.

## Cost Impact

Positive. Defining write intents now keeps backend selection replaceable and avoids retrofitting release approval storage after pilots begin.

## Constraints

- Static demo storage cannot support real release gate mutation or approval ledgers.
- Hosted pilot storage must support package publish gates and approval ledgers.
- Local classroom storage must support local release gates and approval ledger backup/export.
- Approval ledger writes require policy before real signatures are stored.
- All core write intents continue to reject raw learner audio and learner transcripts.

## Verification

Use `docs/verification/PERSISTENCE_ADAPTER_CHECKS.md` after pulling connector-side commits.
