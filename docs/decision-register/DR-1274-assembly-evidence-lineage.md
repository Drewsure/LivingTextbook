# DR-1274: Assembly Evidence Lineage

**Status:** Accepted

**Decision:** Require assembly preflight to read the live package evidence
sidecar and block when its eight required lanes are incomplete.

**Reason:** A package-review packet alone must not imply that the reviewed
multimedia and game package exists.

**Boundary:** Preflight metadata only. No package writer, QR, persistence, or
student activation is enabled.
