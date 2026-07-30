# DR-302: AI Generator Tenant Coverage Storage Contract

Status: Accepted  
Date: 2026-07-31

Decision: Add `ai_generator_tenant_coverage_gate` / `ai-generator-tenant-coverage-gate` to the backend-neutral storage contract.

White-label impact: Strongly positive. Tenant-specific generator readiness becomes durable, auditable, and portable across MiniStar, sample publishers, future partners, hosted deployments, and closed local deployments.

Cost impact: Positive. The record blocks expensive AI calls, verifier workflows, package assembly, route and playlist writes, local packaging, and student assignment until a tenant has the required reviewed records.

Constraints:

- Preserve request-specific covered, partial, and missing generator record lanes.
- Treat tenant-level disabled request builders as partial until request-specific bindings exist.
- Block generator request submission, live model calls, verifier submission, package assembly, route registry writes, media playlist writes, assignment creation, local bundle writes, and student-ready markers.
- Hosted and local adapter plans must both preserve the same record semantics.
- This decision is recorded in `docs/adr/0302-ai-generator-tenant-coverage-storage-contract.md`.
