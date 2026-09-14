# ADR 0777: Review Contract Public Boundary

## Status

Accepted

## Decision

Review-only evidence and AI intake contracts used by the web application are
owned by the neutral content-model package and consumed through its public
package root. Internal module paths remain implementation details.

The boundary includes review-surface scope, prototype intake and return
readiness, AI generation request previews, and verifier submission/result
packets and storage guards.

## Why

White-label tenants and future apps must be able to consume the same reviewed
contract vocabulary without importing web-specific files or relying on package
layout. A public boundary also makes later storage, upload, and service
adapters replaceable without changing feature components.

## Non-goals

This decision does not enable live AI calls, uploads, persistence, student
assignment, or Phaser source promotion. Those capabilities remain gated by
their own evidence, policy, and approval contracts.

## Verification

- Root exports compile through the web typecheck and production build.
- Review panels and sample fixtures no longer import the promoted contracts
  through internal content-model paths.
- Foundation composition and canonical engine runtime checks remain required.
