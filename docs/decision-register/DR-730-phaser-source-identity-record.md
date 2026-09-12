# DR-730: Phaser Source Identity Record

**Date:** 2026-09-13  
**Status:** Accepted  
**Area:** Foundation hardening / canonical game integration

External game candidate reviews now require a repository, snapshot identifier,
exact 40-character source commit SHA, and a repository-relative manifest of
reviewed files with SHA-256 hashes. The frozen MiniStar Phaser reviews point
to commit `eb79ddf5940ab47cc3c45c119c67ee1b6b958e55`. This strengthens the
review-only boundary and does not permit source import or promotion.

Related ADR: `docs/adr/0658-phaser-source-identity-record.md`.
