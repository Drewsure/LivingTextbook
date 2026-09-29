# DR-1276: Delivery Release Lineage Boundary

- **Decision:** Require `quarantineId` and live custody reconciliation before controlled delivery release or metadata writes.
- **Required lineage:** tenant and source checksum, accepted source review, complete multimedia/game evidence, ready package review packet, and matching delivery-mode decision.
- **Reason:** A well-formed manifest must not bypass publisher review evidence.
- **Not enabled:** Student activation, QR printing, package assembly, or hosted persistence activation.
- **Verification:** `scripts/verify-live-release-lineage-boundary.mjs` and `scripts/verify-foundation-composition.mjs`.
