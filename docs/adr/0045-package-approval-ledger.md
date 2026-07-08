# ADR 0045: Package Approval Ledger

Date: 2026-07-09

## Status

Accepted

## Context

The package publish gate tells the team whether a release candidate is blocked, ready, or still under review. A real partner pilot also needs accountability: who approved content, media rights, games, QR stability, policy, deployment, and platform release quality?

Choosing a backend now would be premature, but ignoring the eventual audit shape would make future persistence harder.

## Decision

Add a backend-agnostic package approval ledger scaffold. It is shown on `/teacher/intake` after the package publish gate and records required sign-off roles, owners, status, evidence, next steps, and blockers.

## Consequences

Positive:

- Makes pilot accountability visible early.
- Clarifies who owns media, policy, deployment, and release approval.
- Prepares a durable approval record shape before vendor selection.
- Keeps partner and MiniStar package release workflows aligned.

Tradeoffs:

- Adds another admin panel to the intake page.
- Does not yet provide real signatures, authentication, timestamps, or persistence.
- Requires local verification after connector-side updates.

## Verification

Use `docs/verification/PACKAGE_APPROVAL_LEDGER_CHECKS.md` after pulling connector-side commits.
