# ADR 1183: Assist-Language Audio Reviewer Gate Binding

## Status

Accepted for foundation scaffolding; identity and approval remain blocked.

## Decision

Bind the assist-language audio approval reconciliation preview to the existing
reviewer identity and signature gate shape. The binding carries reviewer gate
identity, tenant/package/unit scope, required reviewer lanes, unresolved
requirements, and scope drift.

## Tenant Boundary

The binding may use a reviewer gate only when its tenant identity matches the
audio reconciliation scope. Tenants without a configured gate are represented
as explicitly unconfigured. No other tenant's gate may be reused.

## Boundaries

- Binding is review-only and side-effect-free.
- Approval capture, approval-ledger writes, signature uploads, release-state
  mutation, catalog admission, media activation, student assignment, and
  progression remain blocked.
- The binding does not authenticate a reviewer or create a signature.

## Verification

`verify:assist-language-audio-catalog-reviewer-gate-binding` validates
deterministic identity, required reviewer lanes, tenant scope, fail-closed
flags, route exposure, and review-only behavior.
