# ADR 0349: AI Prototype Patch Test Readiness Storage Contract

Status: accepted

## Context

Patch test readiness gates are now visible on teacher generator routes, but the platform also needs a backend-neutral contract before hosted or closed-local deployments can store the gate.

## Decision

Add backend schema, migration candidate, migration spec, durable record, and hosted/local adapter coverage for `ai_prototype_patch_test_readiness_gate` / `ai-prototype-patch-test-readiness-gate`.

The contract preserves required test lanes, rollback requirements, patch test harness plan, route safety release gate, rollback drill record, storage contract verification, Codex patch approval decision, and blocked actions.

## Consequences

- Future patch test planning has durable review state across hosted and local deployments.
- Test execution, app file writes, app patch generation, route writes, scoring or reward mutations, audio manifest mutation, package promotion, assignments, and support-language progress remain blocked.
- MiniStar support-language boundaries remain enforceable before any future patch test harness exists.
