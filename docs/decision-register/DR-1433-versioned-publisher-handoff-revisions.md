# DR-1433: Versioned Publisher Handoff Revisions

The first saleable pilot now uses a create-once revision helper for external
publisher handoffs. It copies only declared review inputs, preserves missing
required and omitted optional status, and excludes stale source manifests and
preflight reports. Repository-local paths, symlinks, and overwrite are
rejected. The revised handoff must receive fresh preflight evidence before it
can proceed to any later review gate.

See ADR 1433 and `scripts/create-publisher-pilot-intake-revision.mjs`.
