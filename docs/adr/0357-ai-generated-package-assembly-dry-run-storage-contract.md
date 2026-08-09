# 0357: AI Generated Package Assembly Dry Run Storage Contract

Date: 2026-08-09

## Status

Accepted

## Context

Generator routes now expose review-only generated package assembly dry runs. Those previews show the artifact map that would be required after readiness clears: package JSON, route registry entry, media playlist binding, local companion artifact, and assignment shell.

The preview is useful only if hosted and closed local deployments can preserve it as audit evidence without turning it into a package writer.

## Decision

Add a backend-neutral storage contract for `ai_generated_package_assembly_dry_run` / `ai-generated-package-assembly-dry-run`.

The contract must preserve assembly readiness links, generated package manifest links, artifact maps, source record ids, and blocked dry-run actions. Hosted and local adapters must keep package JSON writes, route registry writes, media playlist writes, local bundle writes, assignment creation, student-ready markers, and support-language-only assembly blocked.

## Consequences

- Generated package dry runs can become auditable without writing content.
- Hosted and closed local deployments share the same dry-run vocabulary.
- Future package writer work requires a separate implementation and release-control decision.
