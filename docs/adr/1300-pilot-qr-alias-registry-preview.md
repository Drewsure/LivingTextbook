# ADR 1300: Pilot QR Alias Registry Preview

Status: Accepted

## Context

The publisher package preview already listed a stable QR registry artifact, but
the handoff did not have one shared contract proving that every printed QR
identity belonged to the same tenant, package, version, target, fallback, and
release lineage. That gap makes a future print workflow vulnerable to alias
drift.

## Decision

Add a review-only QR alias registry preview derived from the exact delivery
manifest, release receipt, and package QR preview set. The preview validates
unique alias ids, printed QR ids, safe internal paths, tenant/package/version
identity, deployment targets, and rollback-evidence references.

## Boundaries

- The preview never writes a durable registry record.
- Production QR printing, redirect mutation, package swaps, and student
  activation remain blocked.
- A missing durable registry, release decision, fallback check, or rollback
  reference remains visible as unresolved evidence.
- The preview is not a substitute for a real publisher rights or release
  decision.

## Verification

- `node scripts/verify-qr-alias-preview-integration.mjs`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run verify:routes:preview`
