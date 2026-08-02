# DR-355: AI Generated Package Assembly Readiness Storage Contract

Date: 2026-08-02

## Decision

Preserve AI generated package assembly readiness as a backend-neutral durable record before any generated package assembly workflow can be considered.

## Why

Assembly readiness is the final review surface before a generated draft could become a real package. It must be auditable in hosted and closed local deployments, but it cannot itself assemble packages, write routes, create playlists, write local bundles, assign students, mark student-ready state, or treat support-language-only review as sufficient.

## Required Contract

- `ai_generated_package_assembly_readiness` schema entity.
- `m080-ai-generated-package-assembly-readiness-records` migration candidate.
- `spec-ai-generated-package-assembly-readiness` migration spec.
- `ai-generated-package-assembly-readiness-record` durable record.
- Hosted and local adapter write intents.
- Verifier coverage for schema, migrations, adapter plans, durable records, and route visibility.

## Blocked Actions

- Package assembly.
- Route registry write.
- Media playlist write.
- Local bundle write.
- Assignment creation.
- Student-ready marker.
- Support-language-only assembly.
