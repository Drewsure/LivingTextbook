# DR-1309: Local Package Handoff Receipt

Verified local packages now expose a bounded handoff receipt that binds
package, release, source checksum, QR print artifact, QR HTML checksum, QR
registry, route, game, media, and hosted-persistence identities. The receipt
is available only behind an explicit handoff-read gate and preserves the
no-learner-data, no-write, no-activation, and no-QR-mutation boundaries.

See `docs/adr/1310-local-package-handoff-receipt.md`.
