# ADR 0351: AI Prototype Patch Test Harness Storage Contract

Status: accepted

## Context

Patch test harness plans are visible as design-only artifacts. The platform needs durable hosted/local storage coverage before a future harness implementation can rely on those plans.

## Decision

Add backend schema, migration candidate, migration spec, durable record, and hosted/local adapter coverage for `ai_prototype_patch_test_harness_plan` / `ai-prototype-patch-test-harness-plan`.

The contract preserves runtime policy, required inputs, harness sections, non-execution outputs, and blocked harness actions.

## Consequences

- Future harness implementation work has durable planning state.
- Runnable harness behavior, test execution, Playwright runs, app file writes, route writes, scoring or reward mutation, audio manifest mutation, package promotion, assignment, and support-language progress remain blocked.
- Closed-local deployments can back up/export harness plans without enabling offline execution.
