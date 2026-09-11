# ADR 0575: Codex Decision Collection Identity

Status: Accepted

## Decision

Require the Codex integration-decision collection to contain unique decision
IDs and unique tenant/request pairs.

## Context

Individual review packets now enforce unique evidence-check identities. A
multi-tenant review queue also needs collection-level identity protection so a
second packet cannot silently replace or masquerade as the decision for the
same tenant and prototype request.

## Consequences

- Review queue entries remain addressable and tenant-scoped.
- Duplicate packet identity is rejected before any future review handoff.
- The rule applies equally to MiniStar and partner tenants.
- No integration approval, import, route write, scoring mutation, reward
  write, package promotion, playlist write, or assignment is enabled.

## Verification

Runtime behavior verification covers duplicate decision IDs and duplicate
tenant/request pairs alongside valid packet validation. Full foundation
verification remains required before push.
