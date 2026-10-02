# ADR 1432: Clarify Publisher Audit Blockers

## Decision

The saleability audit distinguishes an incomplete publisher handoff from
invalid or tampered evidence. When durable intake or source-preflight records
identify required missing files, the audit reports the relative paths and
instructs the operator to create a new versioned evidence packet. Existing
evidence remains immutable.

## Rationale

An operator should be able to act on a real missing asset without mistaking a
normal review blocker for malformed evidence. The distinction improves the
publisher handoff while preserving the same fail-closed release gate.

## Safety boundary

The diagnostic summary never changes status, accepts evidence, overwrites
reports, promotes assets, prints QR codes, activates persistence, or enables
students. Checksum, schema, identity, and protected-action validation remain
authoritative.

## Verification

`node scripts/audit-first-saleable-pilot.mjs --self-test`

Run the audit against an external publisher root to see required missing paths
in the next action.
