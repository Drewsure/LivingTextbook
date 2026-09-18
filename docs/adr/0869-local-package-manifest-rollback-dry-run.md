# ADR 0869: Local Package Manifest And Rollback Dry-Run

## Status

Accepted for foundation rehearsal.

## Context

The local bundle plan names package artifacts and printed QR behavior, while
the recovery and export dry-runs define data boundaries. A saleable white-label
companion needs one versioned manifest preview that can show what a rollback
would affect without becoming a package activator or route writer.

## Decision

Define `LocalBundlePackageManifestRollbackDryRun` as a tenant-scoped,
provider-neutral contract. It covers content, media, route, game, and
reporting artifacts with safe relative paths, checksum state, current and
fallback versions, stable QR fallback, and six rollback impact domains. It
requires all mutation, deletion, activation, and rollback flags to remain
false and returns `sideEffect: "none"`.

## Consequences

Teachers, publishers, and platform operators can inspect release and rollback
impact before selecting a provider. Direct file targets, traversal paths,
unreviewed media replacement, learner-data deletion, QR mutation, and bundle
activation remain impossible from the preview.
