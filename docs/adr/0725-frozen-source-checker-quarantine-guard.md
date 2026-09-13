# ADR 0725: Frozen Source Checker Quarantine Guard

## Status

Accepted

## Decision

The frozen Phaser source evidence checker must resolve every manifest path
inside the configured isolated review snapshot before reading it. Absolute
paths and traversal paths that escape the snapshot fail closed.

Add `npm run verify:phaser-source-evidence-contract` to enforce that the
checker remains read-only and isolated. The contract check requires hashing,
read-only file access, the approved review-root override, source identity
fields, and path containment. It rejects write, import, process, and
`apps/web`/`apps/ai-service` mutation markers.

## Consequences

The evidence boundary is safer against malformed or accidentally broadened
manifests. The checker remains outside candidate promotion and does not import
source, activate routes, write learner data, or approve a wrapper. The full
foundation composition now protects this boundary automatically.
