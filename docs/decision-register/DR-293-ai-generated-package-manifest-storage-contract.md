# DR-293: AI-Generated Package Manifest Storage Contract

Status: Accepted  
Date: 2026-07-31

Decision: Promote `ai_generated_package_manifest` into the backend-neutral schema, migration, adapter, durable record, persistence boundary, and route verification layers.

White-label impact: Strongly positive. Tenants can eventually use AI-generated game packages while the platform preserves tenant-specific prompt packages, media rights, audio rules, review rules, release locks, and local deployment needs.

Cost impact: Positive. A single manifest storage target reduces rework by preventing scattered generated outputs from becoming separate integration paths.

Constraints:

- The manifest must preserve prompt, draft JSON, audio, engine, gamification, verifier, review queue, media-rights, and release-lock lineage.
- Hosted and local adapters must use the same record vocabulary.
- Package assembly, route registry writes, media playlist writes, assignment writes, local bundle writes, and student-ready markers remain blocked.
- Generated manifests cannot bypass source review, teacher review, verifier checks, approval ledger, or release-control gates.
- This decision is recorded in `docs/adr/0293-ai-generated-package-manifest-storage-contract.md`.
