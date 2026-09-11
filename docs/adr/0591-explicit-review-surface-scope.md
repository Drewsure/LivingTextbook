# ADR 0591: Explicit Review-Surface Scope

Status: Accepted

## Decision

Evidence packet flows and prototype storage guards must declare whether they are platform contracts or tenant records. Review panels must show that scope visibly.

## Context

Tenant workbenches legitimately reuse generic platform policies, but an implicit scope makes it difficult to distinguish shared rules from tenant-owned evidence. That ambiguity is unsafe for a white-label product and for future package storage.

## Consequences

- Generic evidence and storage rules are visibly identified as platform contracts.
- Future tenant-specific flows must declare tenant scope in their data shape.
- Review users can distinguish policy from tenant state before any storage or import decision.
- The scope label does not authorize live writes, package promotion, or assignment.

## Verification

Prototype-review verification, web typecheck, full foundation verification, production build, and active route checks remain required.
