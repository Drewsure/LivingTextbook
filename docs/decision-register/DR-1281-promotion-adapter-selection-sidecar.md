# DR-1281: Promotion Adapter Selection Sidecar

Date: 2026-09-30
Status: Accepted

The publisher pilot now records an explicit review-only package adapter choice
before the package review packet can advance. The choice is closed-local,
hosted-PWA, or hybrid, and is bound to tenant, quarantine, package, and source
checksum identities.

This record closes only the adapter-selection prerequisite. It does not grant
assembly, promotion, QR printing, hosted persistence, or student use. Release
lineage must also verify that the adapter matches the delivery manifest mode.

See ADR 1281.
