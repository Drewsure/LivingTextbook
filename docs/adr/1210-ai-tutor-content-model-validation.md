# ADR 1210: AI Tutor Content-Model Validation

**Status:** Accepted  
**Date:** 2026-09-25

## Context

AI Tutor entitlement and unit plans are optional white-label package data.
They may arrive from teacher authoring, publisher intake, or a future AI
authoring service, so the shared content model must not assume that arrays,
strings, booleans, enum values, or usage limits are already trustworthy.

## Decision

The canonical content-model validators reject malformed AI Tutor entitlement
and unit-plan values deterministically. They validate bounded unit identities,
supported package tiers, tutor modes, source scopes, unique level/mode lists,
integer usage and response limits, and optional boolean flags. Baseline
packages remain valid when AI Tutor is absent or disabled.

## Consequences

- Malformed optional AI Tutor data cannot crash package validation or silently
  widen the tenant feature surface.
- White-label tenants can carry different premium plans without changing the
  core student package contract.
- No validator change enables model calls, speech services, billing,
  microphone capture, transcripts, student unlocks, or live assignment.

## Verification

The entitlement static contract check and runtime behavior harness cover valid
plans, malformed arrays, unsupported modes/scopes, duplicate lists, invalid
limits, invalid flags, and the existing disabled baseline package.
