# DR-731: Phaser Evidence Reference Integrity

**Date:** 2026-09-13  
**Status:** Accepted  
**Area:** Foundation hardening / external candidate review

Every Phaser candidate finding must resolve its evidence reference to a file
in the candidate's hashed source manifest. This keeps the review packet tied
to the exact files inspected and prevents untracked citations from being
treated as integration evidence. The change remains review-only and does not
promote external source.

Related ADR: `docs/adr/0659-phaser-evidence-reference-integrity.md`.
