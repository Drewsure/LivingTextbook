# DR-1282: Versioned Package Review Packet Revisions

Date: 2026-09-30
Status: Accepted

Blocked package review packets are immutable. When a later promotion-adapter
decision is recorded, the review route creates the next deterministic packet
revision as a new sidecar and links it to the superseded packet. The reader
selects the highest valid revision while preserving tenant, quarantine,
checksum, and no-activation constraints.

See ADR 1282.
