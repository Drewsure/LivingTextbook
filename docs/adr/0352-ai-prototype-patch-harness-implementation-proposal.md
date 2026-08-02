# ADR 0352: AI Prototype Patch Harness Implementation Proposal

Status: accepted

## Context

Harness plans define what a future test harness must cover. Before code can exist, the platform needs a review-only implementation proposal that names file scope and review gates without creating files.

## Decision

Add review-only AI prototype patch harness implementation proposals to tenant generator routes after patch test harness plans.

The proposal names future harness manifest adapters, assertion maps, mobile checklists, route smoke checklists, storage checklists, rollback checklists, review gates, and blocked actions.

## Consequences

- Future harness implementation work has a visible file-scope review checkpoint.
- Harness implementation, test execution, Playwright runs, app file writes, patch generation, route mutation, student-facing routes, scoring or reward mutation, audio manifest mutation, package promotion, assignment, and support-language progress remain blocked.
- MiniStar implementation proposals must preserve hiragana support-language assertion boundaries.
