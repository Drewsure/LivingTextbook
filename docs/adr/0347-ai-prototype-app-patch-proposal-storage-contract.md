# ADR 0347: AI Prototype App Patch Proposal Storage Contract

Status: accepted

## Context

AI prototype app patch proposal previews name future file scope, pre-patch gates, test gates, and blocked actions. Before any future patch-generation workflow exists, hosted and closed-local deployments need the same durable review record shape.

## Decision

Add backend-neutral storage coverage for `ai_prototype_app_patch_proposal` / `ai-prototype-app-patch-proposal`.

Hosted and local adapters must preserve proposed file scope, required pre-patch gates, required test gates, rollback requirements, reviewer identity/signature requirement, release-control binding, and blocked patch actions.

## Consequences

- Patch planning becomes auditable before it becomes operational.
- App file writes, app patch generation, direct imports, route writes, student-facing routes, scoring mutations, Star Dust or reward writes, audio manifest mutation, package promotion, assignments, and support-language progress stay blocked.
- Outside prototypes can continue through wrapper-first review without creating uncontrolled `apps/web` changes.
- MiniStar support-language progress remains blocked while English remains the target-language trigger.
