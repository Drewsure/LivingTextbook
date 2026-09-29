# DR-1259: Live Publisher Readiness Binding

## Decision

Derive the publisher package readiness binding from the actual quarantine
handoff and assembly-preflight APIs, while leaving package assembly and release
gates closed.

## Evidence

The live binding preserves the deterministic handoff, review packet, and
assembly-preflight identities. It marks package preview, readiness
reconciliation, delivery, release, package index, and hosted opt-in as blocked
until those records are explicitly linked.

## Operator meaning

This is the first honest view of a publisher's submitted source. A blocked
status means work remains; it never means the source was lost. A passed live
check means only that its evidence is present and structurally valid.
