# DR-736: Canonical Completion Acceptance Gate

**Date:** 2026-09-13  
**Status:** Accepted  
**Area:** Canonical game integration / progression safety

The shared playable route shell now treats canonical event validation as an
acceptance gate. Missing or invalid completion evidence pauses progression,
Star Dust, and next-activity state while retaining visible contract errors.
This keeps individual game skins from granting state outside the shared
platform contract.

Related ADR: `docs/adr/0664-canonical-completion-acceptance-gate.md`.
