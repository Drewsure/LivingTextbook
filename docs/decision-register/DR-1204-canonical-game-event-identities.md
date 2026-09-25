# DR-1204: Canonical Game Event Identity Boundaries

Canonical game events now reject blank, oversized, path-like, or otherwise
unsafe unit, launch, and student-session identities. Namespaced unit keys stay
supported for publisher content, while launch and session IDs use a narrower
portable shape.

This protects tenant joins, reporting, persistence boundaries, and replay
identity without changing scoring authority or enabling any external source
promotion. Z.ai/Phaser candidates remain isolated until their complete
`evidence/return-package.json` package passes review.

References: ADR 1204 and the 2026-09-25 canonical game identity build session.
