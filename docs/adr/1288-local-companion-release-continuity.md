# ADR 1288: Local Companion Release Continuity Packet

Date: 2026-09-30
Status: Accepted

## Decision

The packaged-companion deployment path must carry one tenant- and
package-scoped continuity packet covering installer identity, supported-device
evidence, yearly update strategy, migration, rollback, backup, restore,
retention, and operator handoff.

The packet is review-only until the publisher and school provide the required
artifacts. Installation, update execution, recovery execution, package writes,
route mutation, export, and student promotion remain explicitly disabled.

## Rationale

A local textbook companion is a product, not merely a folder of web assets.
Without an explicit continuity record, a publisher cannot safely maintain a
year-on-year textbook edition or recover a school device. Joining these lanes
under the same package identity makes the future handoff auditable and keeps
the operational promises separate from the currently available rehearsal UI.

## Boundaries

- This packet does not choose an installer technology or storage provider.
- It does not create an installer, copy media, migrate records, or activate a
  local package.
- It must remain tenant-bound and compatible with the existing recovery,
  release, QR, and persistence gates.
- Hosted PWA remains the lower-support-cost first pilot option until local
  continuity evidence is accepted.
