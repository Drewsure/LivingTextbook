# ADR 0047: Release Control Adapter Write Intents

Date: 2026-07-09

## Status

Accepted

## Context

Package publish gates and approval ledgers are now part of the durable record map. The persistence adapter map previously named hosted writes for route registry, launch sessions, and event streams, plus local writes for media bundles and progress exports.

That left a gap: future storage could be chosen without accounting for release-control writes.

## Decision

Add release-control write intents to adapter plans:

- Hosted pilot adapter writes package publish gates.
- Hosted pilot adapter writes package approval ledgers after policy is accepted.
- Local classroom adapter writes local package publish gates.
- Local classroom adapter writes local package approval ledgers after policy is accepted.

## Consequences

Positive:

- Release control becomes part of backend/vendor comparison.
- Hosted and local deployment paths stay aligned.
- Approval evidence, rollback, export, and backup needs are visible before implementation.
- Static demo mode remains honest about what it cannot do.

Tradeoffs:

- Adapter warnings increase until policy and backend decisions are accepted.
- Local/closed deployment scope remains visibly larger than hosted pilot scope.

## Verification

Use `docs/verification/PERSISTENCE_ADAPTER_CHECKS.md` after pulling connector-side commits.
