# DR-1311: Local Package Integrity Read Lane

**Status:** Accepted

The verified local package now exposes its checksum ledger through a separate,
bounded, metadata-only API. It requires an explicit read gate and a successful
runtime integrity verification. It remains separate from raw payload access,
package export, QR mutation, activation, hosted persistence, and learner data.

See `docs/adr/1312-local-package-integrity-read-lane.md`.

