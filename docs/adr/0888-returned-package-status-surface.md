# ADR 0888: Returned Package Status Surface

## Status

Accepted for controlled candidate review.

## Context

The teacher prototype workbench displays returned-package manifests and their
alignment errors. The panel previously hard-coded every manifest as `Not
returned`, which could misrepresent a future review-only or blocked package and
hide the exact Phaser commit from the operator.

## Decision

The returned-package panel must derive its status label from the manifest
status. When a manifest contains a source commit, the panel must display that
commit alongside the snapshot identity. The panel remains informational:
status display does not approve, import, promote, assign, or activate a
package.

## Consequences

- Teacher review surfaces cannot silently mislabel returned evidence.
- Phaser/hybrid provenance remains visible at the operator boundary.
- Existing not-returned previews retain their warning state and behavior.

## Evidence

- `apps/web/src/features/content-intake/AiPrototypeReturnedPackageManifestPanel.tsx`
- `scripts/verify-prototype-review-readiness.mjs`
