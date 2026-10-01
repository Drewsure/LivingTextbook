# ADR 1402: Recheck Source Preflight Lineage At Package Binding

## Status

Accepted for the first saleable white-label pilot foundation.

## Context

The source preflight evidence record is durable and quarantine-bound, but the
binding route accepts a package identity from the query. Without a final
comparison, a valid record could be displayed under a different package
request even though downstream actions remain blocked.

## Decision

Before exposing `preflightReference`, require the stored evidence to match the
authorized tenant, requested package id, quarantined unit key, and normalized
source checksum. On mismatch, withhold the reference and return a bounded
lineage error while keeping the bridge review-only and blocked.

## Consequences

- Package review cannot present a valid source preflight under the wrong
  package identity.
- The route remains metadata-only and does not change approval or release
  behavior.
- End-to-end rehearsal requires a successful local production build; static
  verification remains available when the machine cannot complete Next build.

## Verification

- `npm run typecheck --workspace @living-textbook/web`
- `node scripts/verify-publisher-source-preflight-evidence-binding.mjs`
- `node scripts/verify-source-package-evidence-binding.mjs`
- `node scripts/verify-publisher-intake-rehearsal.mjs` after a production build
