# DR-737: Phaser Source Evidence Reproducibility Check

**Date:** 2026-09-13  
**Status:** Accepted  
**Area:** Foundation hardening / external candidate provenance

Added a standalone source-evidence verifier that compares the review packet's
SHA-256 manifest with the isolated frozen Z.ai snapshot. It confirms the
current five-file packet without importing external code and stays outside
the normal foundation gate because the snapshot is intentionally external.

Related ADR: `docs/adr/0665-phaser-source-evidence-reproducibility-check.md`.
