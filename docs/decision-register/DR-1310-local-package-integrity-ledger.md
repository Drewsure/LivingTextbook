# DR-1310: Local Package Integrity Ledger

**Status:** Accepted

Local closed-local and hybrid packages now carry a checksum-bound integrity
ledger for copied source/media files and generated metadata. Runtime access
fails closed when a listed file is missing or changes. The ledger is metadata
only and does not authorize export, QR mutation, activation, hosted
persistence, or learner records.

See `docs/adr/1311-local-package-integrity-ledger.md`.

