# ADR 1278: Live Hosted Opt-In Preview

## Status

Accepted for foundation hardening.

## Decision

The live package-readiness binding derives a review-only hosted persistence
opt-in preview when the publisher selects hosted or hybrid delivery. The preview
uses the live quarantine identity, package identity, review packet identity, and
source checksum.

## Why

The manifest already carries a hosted packet identity, but the live handoff must
show the actual missing commercial and operational decisions before hosted
persistence can become a saleable option.

## Boundaries

The preview is not an opt-in capture, provider selection, credential store,
learner record, or activation control. All hosted writes remain disabled until a
separate policy and release decision exists. Closed-local fallback is preserved.

The teacher handoff renders the live preview returned by the readiness binding,
including its identities, check status, blockers, required decisions, and
explicit no-write state. This is display-only and does not create a decision
record.

## Verification

`scripts/verify-hosted-persistence-opt-in-decision-packet.mjs` and the full
foundation composition verify the factory, live binding, and blocked write
boundary.
