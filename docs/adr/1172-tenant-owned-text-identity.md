# ADR 1172: Tenant-Owned Text Identity

## Status

Accepted

## Context

White-label tenants control vocabulary, sentences, labels, reward names, and
report-facing text. Those values can repeat legitimately. Using visible text
as the only UI identity can produce duplicate-key warnings and unstable row
reconciliation in teacher and student review surfaces.

## Decision

Use deterministic positional or domain-scoped keys for repeated tenant-owned
content across worksheets, flashcards, teacher reports, release evidence,
session monitors, entitlements, and draft previews. Keep the visible content
unchanged and keep domain IDs where they already represent actual identity.

## Consequences

Repeated tenant content remains independently addressable without changing
audio, report meaning, scoring, progression, persistence, or review-only
policy. The rule adds no production storage, launch permission, or content
mutation behavior.

## Verification

Run `node scripts/verify-review-list-key-stability.mjs`, followed by the full
foundation, typecheck, canonical integration, replay, and production-build
checks.
