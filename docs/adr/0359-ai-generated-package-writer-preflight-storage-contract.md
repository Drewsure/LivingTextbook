# 0359: AI Generated Package Writer Preflight Storage Contract

Date: 2026-08-09

## Status

Accepted

## Context

Generator routes now show review-only package writer preflights after assembly dry runs. Those preflights name the future writer targets: package JSON, route registry, media playlist, local companion, assignment shell, and rollback map.

Hosted and closed local deployments need the same preflight vocabulary before any future writer implementation is designed.

## Decision

Add a backend-neutral storage contract for `ai_generated_package_writer_preflight` / `ai-generated-package-writer-preflight`.

The contract must preserve assembly dry-run links, assembly readiness links, package id previews, writer targets, required evidence, and blocked writer actions. Hosted and local adapters must keep writer execution, package JSON writes, route registry writes, media playlist writes, local bundle writes, assignment creation, student-ready markers, and support-language-only writers blocked.

## Consequences

- Generated package writer planning can become auditable without writing packages.
- Hosted and closed local deployments share the same writer-preflight vocabulary.
- Future package writer implementation requires a separate implementation, storage, and release-control decision.
