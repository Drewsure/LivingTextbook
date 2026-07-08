# ADR 0046: Package Release Durable Records

Date: 2026-07-09

## Status

Accepted

## Context

The platform now has a package publish gate and a package approval ledger. These are not decorative admin panels; they are the controls that prevent a demo package from being treated as pilot-publishable before content, media, games, QR, policy, deployment, and platform review are complete.

The persistence contract previously tracked tenant config, reviewed packages, QR routes, launch sessions, event streams, media manifests, deployment profiles, and report policy. It did not yet include package release gates or approval ledgers as durable records.

## Decision

Add `package-publish-gate` and `package-approval-ledger` to the shared persistence record categories and sample durable record map.

## Consequences

Positive:

- Release control becomes part of the backend selection criteria.
- Approval ownership, evidence, and blockers are visible before vendor selection.
- White-label publisher maintenance has a clearer yearly release path.
- Local/closed deployment remains compatible because the records name a local classroom store path.

Tradeoffs:

- The durable record map has more warnings until policy and backend choices are made.
- Real sign-off capture still requires authentication, approver identity, timestamps, evidence storage, and policy acceptance.

## Verification

Use `docs/verification/PERSISTENCE_BOUNDARY_CHECKS.md` after pulling connector-side commits.
