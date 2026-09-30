# ADR 1363: Shared Reviewed-Custody Summary Contract

## Status

Accepted for the review-only pilot foundation.

## Decision

The bounded reviewed local bundle-manifest custody summary is a public
content-model contract. Server readiness routes and client handoff panels must
consume that shared type and validator rather than defining parallel local
shapes.

## Consequences

- White-label tenant adapters receive consistent custody semantics.
- Status, identity, checksum, reviewer, and timestamp fields cannot drift
  between server and UI layers.
- The summary remains metadata-only and cannot carry manifest bodies, paths,
  bytes, credentials, learner records, or activation permission.

## Verification

The shared package root must export the contract, TypeScript must pass, and
the publisher assembly-preview and foundation-composition verifiers must stay
green.
