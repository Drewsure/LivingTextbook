# ADR 0293: AI-Generated Package Manifest Storage Contract

Status: Accepted  
Date: 2026-07-31

## Decision

Promote `ai_generated_package_manifest` / `ai-generated-package-manifest` into the backend-neutral storage contract.

The contract is represented across the backend schema draft, backend migration candidates, backend migration specs, hosted/local persistence adapter write intents, durable record map, persistence boundaries, backend storage verifier, and teacher intake route verification.

## Rationale

AI-generated packages should have one durable lineage record before any package assembly work begins. This keeps generated output tied to reviewed prompt packages, draft JSON previews, audio coverage plans, engine bindings, gamification mappings, verifier packets, review queue items, media-rights evidence, and release locks.

This is especially important for a white-label platform because tenants may have different curricula, media rights, assist-language rules, AI package entitlements, and local deployment requirements.

## Consequences

- Hosted and local deployments must preserve the same generated package manifest vocabulary.
- Package assembly, route registry writes, media playlist writes, assignment writes, local bundle writes, and student-ready markers remain blocked until review, approval ledger, media, audio, and release-control gates pass.
- Generated manifests are lineage and gate records only; they are not production packages, public routes, playlists, assignments, or local bundles.
- `npm run verify:backend-storage` now checks the generated package manifest contract.
