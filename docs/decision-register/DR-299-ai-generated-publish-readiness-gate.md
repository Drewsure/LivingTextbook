# DR-299: AI Generated Publish Readiness Gate

Status: Accepted  
Date: 2026-07-31

Decision: Add an `ai_generated_publish_readiness_gate` preview after generated manifest, verifier, correction queue, and reward gates.

White-label impact: Strongly positive. Every tenant sees the same safe path from AI draft to reviewed package without letting generated content bypass release control.

Cost impact: Positive. The gate prevents expensive premature backend, media, route, and assignment work by showing exactly which records must exist before publish workflows are built.

Constraints:

- The gate must gather correction queue clearance, verifier packet approval, manifest completeness, reward readiness, release-control binding, and teacher approval ledger capture.
- The gate may show review/correction actions, but must not enable generated route creation, route registry writes, media playlist writes, assignment creation, local bundle writes, or student-ready markers.
- This is a review-only scaffold until a storage contract and release workflow are explicitly approved.
- This decision is recorded in `docs/adr/0299-ai-generated-publish-readiness-gate.md`.
