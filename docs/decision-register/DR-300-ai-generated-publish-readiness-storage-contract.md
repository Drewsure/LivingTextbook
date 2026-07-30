# DR-300: AI Generated Publish Readiness Storage Contract

Status: Accepted  
Date: 2026-07-31

Decision: Add `ai_generated_publish_readiness_gate` / `ai-generated-publish-readiness-gate` to the backend-neutral storage contract.

White-label impact: Strongly positive. Generated package publishing becomes a shared tenant-safe record instead of a UI assumption or MiniStar-specific release rule.

Cost impact: Positive. The record blocks expensive route, playlist, assignment, and local packaging work until verifier, reward, release, approval, and policy gates are ready.

Constraints:

- Preserve correction queue clearance, verifier packet approval, manifest completeness, reward readiness, release-control binding, and teacher approval ledger capture.
- Block generated route creation, route registry writes, media playlist writes, assignment creation, local bundle writes, and student-ready markers.
- Hosted and local adapter plans must both preserve the same record semantics.
- This decision is recorded in `docs/adr/0300-ai-generated-publish-readiness-storage-contract.md`.
