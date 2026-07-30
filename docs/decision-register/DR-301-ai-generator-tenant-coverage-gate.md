# DR-301: AI Generator Tenant Coverage Gate

Status: Accepted  
Date: 2026-07-31

Decision: Add a tenant coverage gate to the AI teaching game generator route.

White-label impact: Strongly positive. A tenant generator route can load without pretending that tenant-specific prompt, audio, engine, reward, verifier, manifest, draft, correction, and publish records already exist.

Cost impact: Positive. The gate prevents premature live model calls, verifier workflows, package assembly, route writes, playlist writes, assignment writes, and AI Tutor activation until the tenant has enough reviewed records to justify the next build step.

Constraints:

- Show coverage by generator request, not only by tenant route.
- Treat tenant-level disabled request builders as partial until request-specific bindings exist.
- Keep missing generator preview records visible.
- Block generator request submission, live model calls, verifier submission, package assembly, route or playlist creation, and student assignment while coverage is incomplete.
- This decision is recorded in `docs/adr/0301-ai-generator-tenant-coverage-gate.md`.
