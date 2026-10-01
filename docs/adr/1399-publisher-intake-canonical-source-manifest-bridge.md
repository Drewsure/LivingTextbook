# ADR 1399: Bridge Publisher Intake To The Canonical Source Manifest

## Status

Accepted for the first saleable white-label pilot foundation.

## Context

The publisher pilot intake kit already captured textbook source, media lanes,
unit identity, and delivery intent. The source-review system consumed a
separate `publisher-source-manifest.json`, which made the operator translate
the same declaration twice and created a risk of MIME or required-state drift.

## Decision

Add a create-once bridge command that reads a completed
`publisher-pilot-intake.json` and writes only the canonical
`publisher-source-manifest.json`. It preserves source and media lanes,
required flags, unit metadata, and the MIME vocabulary used by the real source
preflight. It derives a deterministic pilot package identity from tenant and
unit metadata. It refuses overwrite and performs no copy, upload, quarantine,
assembly, QR, persistence, or student operation.

## Consequences

- Publisher operators have one intake declaration and one canonical preflight
  path.
- MIME compatibility and inventory completeness can be verified immediately.
- A generated manifest remains review evidence, not rights approval, package
  readiness, release authorization, or student access.
- Future package assembly must consume independently reviewed custody records,
  not this bridge output alone.

## Verification

- `node scripts/create-publisher-source-manifest-from-pilot-kit.mjs --self-test`
- `node scripts/verify-publisher-pilot-source-manifest-bridge.mjs`
- `npm run verify:foundation-composition`
