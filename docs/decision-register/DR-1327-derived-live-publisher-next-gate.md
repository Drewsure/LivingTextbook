# DR-1327: Derived Live Publisher Next Gate

Date: 2026-09-30  
Status: Accepted

The live publisher review journey now derives `nextGateIds` and gate-specific
`nextGates` from the unresolved review state. The first incomplete source,
evidence, packet, delivery, adapter, release, or rehearsal gate is surfaced
without changing any protected action.

This keeps the publisher handoff operationally useful while package assembly,
promotion, QR printing, hosted persistence, and student use remain blocked.
See ADR 1328.
