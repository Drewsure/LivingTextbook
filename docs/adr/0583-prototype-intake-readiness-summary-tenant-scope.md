# ADR 0583: Prototype Intake Readiness Summary Tenant Scope

Status: Accepted

## Decision

Prototype-intake readiness summaries must carry an explicit tenant identity. The platform game-readiness route uses the `platform` summary, while tenant prototype routes construct a tenant-scoped summary and pass that same instance to both the alert and summary panels.

## Context

Tenant-scoped alerts are only reliable when the readiness signal they summarize has the same scope. Reusing one global summary object on every tenant route could make a partner review appear to be based on another tenant’s evidence, even when the displayed lanes happen to be identical.

## Consequences

- Alert and readiness summary identity remain paired at the route boundary.
- Future tenant-specific evidence can replace the scoped factory without changing panel contracts.
- Shared sample lanes remain review-only previews and do not imply returned packages or integration approval.

## Verification

Prototype-review verification, web typecheck, full foundation verification, production build, and active route checks remain required.
