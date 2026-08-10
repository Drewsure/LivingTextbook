# ADR 0373: Codex Patch Approval Decision Storage Contract

Date: 2026-08-10

## Status

Accepted

## Context

Tenant generator routes now expose review-only Codex patch approval decision previews. Those previews name patch scope, route safety, rollback, storage, reviewer identity, decision options, approval evidence checks, and blocked patch actions before any app file work can exist.

## Decision

Add a backend-neutral `codex_patch_approval_decision` schema contract and matching `codex-patch-approval-decision` durable record category.

Hosted and local adapters must preserve linked patch proposal, patch test readiness gate, patch harness plan, patch harness implementation proposal, route safety release gate, rollback drill record, storage contract verification, reviewer identity signature gate, selected decision, decision status, approval evidence checks, decision options, and blocked patch actions.

## Consequences

- Future patch approval work has an auditable hosted/local record shape before signed approval capture exists.
- Hosted and closed-local deployments share the same Codex patch approval vocabulary.
- This does not approve a patch, write app files, generate patches, execute tests, invoke Playwright, mutate routes, expose student-facing routes, mutate scoring or rewards, mutate audio manifests, promote packages, assign students, or trigger support-language progress.
