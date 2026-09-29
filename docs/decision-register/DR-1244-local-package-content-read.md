# DR-1244: Local Package Content Read

- **Status:** Accepted
- **Date:** 2026-09-29
- **Decision:** Add a disabled-by-default, tenant-bound reader for approved
  `ContentPackage` data inside an assembled local package.
- **Why:** The local handoff needs a real content lane before local game
  rendering can use publisher material; metadata-only navigation is not enough.
- **Guardrails:** Require the metadata reader first; resolve only the declared
  content path inside the package boundary; validate canonical content and
  approved review status; reject learner/progression records; keep writes,
  QR mutation, student activation, hosted persistence activation, and release
  changes blocked.
- **Acceptance evidence:** Focused content-reader verifier, foundation
  composition, typecheck, and production build.
- **Follow-up:** Bind this reader to the local game route adapter after a real
  publisher package and local-device rehearsal exist.

