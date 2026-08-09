# DR-357: AI Generated Package Assembly Dry Run Storage Contract

Decision: Preserve generated package assembly dry runs as backend-neutral durable records before any generated package writer, route writer, playlist writer, local bundle writer, assignment writer, or student-ready marker exists.

Rationale: The dry-run panel previews future artifacts for review, but the platform needs an auditable record that does not itself create student-facing content. This keeps white-label hosted and closed local deployments aligned.

Cost impact: Positive. The record prevents accidental package-writing work and supports backend comparison without committing to a vendor-specific implementation.

Scope:

- `ai_generated_package_assembly_dry_run` schema entity.
- `m081-ai-generated-package-assembly-dry-run-records` migration candidate.
- `spec-ai-generated-package-assembly-dry-run` migration spec.
- `ai-generated-package-assembly-dry-run-record` durable record.
- Hosted and local persistence write intents.

Boundaries:

- No package JSON write.
- No route registry write.
- No media playlist write.
- No local bundle write.
- No assignment write.
- No student-ready marker.
- No support-language-only assembly.
