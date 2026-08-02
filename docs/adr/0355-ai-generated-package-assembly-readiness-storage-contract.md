# ADR 0355: AI Generated Package Assembly Readiness Storage Contract

## Status

Accepted.

## Context

The generator now shows review-only package assembly readiness previews. Those previews combine manifest, promotion, publish readiness, release candidate, teacher approval, media-rights, target-language audio, and support-language boundary lanes. The next backend contract must preserve the same lanes for hosted and closed local deployments without enabling live package assembly.

## Decision

Add a backend-neutral storage contract for `ai_generated_package_assembly_readiness` / `ai-generated-package-assembly-readiness`.

The contract must preserve assembly readiness lanes, linked generated package records, teacher approval evidence, media-rights evidence, target-language audio approval, and support-language assembly blockers. Hosted and local adapters must keep package assembly, route registry writes, media playlist writes, local bundle writes, assignment creation, student-ready markers, and support-language-only assembly blocked.

## Consequences

- Generated package assembly decisions can become auditable without creating live package writes.
- Hosted and closed local deployments share the same assembly-readiness vocabulary.
- Future package assembly work requires a separate implementation and release-control decision.
