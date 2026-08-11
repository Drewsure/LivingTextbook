# ADR 0377: AI Prototype Patch Authorization Release Lock Storage Contract

## Status

Accepted.

## Context

Tenant generator routes now expose review-only patch authorization release locks. Those locks name release-control binding, signed approval acceptance, patch scope, test evidence, route safety, rollback, storage, reviewer identity, narrow authorization scope, and blocked patch actions before any app file work can exist.

## Decision

Add a backend-neutral `ai_prototype_patch_authorization_release_lock` schema contract and matching `ai-prototype-patch-authorization-release-lock` durable record category.

Hosted and local adapters must preserve linked signed approval preflight, Codex patch approval decision, release-control binding, route safety release gate, rollback drill record, storage contract verification, reviewer identity signature gate, required release locks, authorization scope, forbidden-until-unlocked blockers, release evidence, next required records, and blocked patch actions.

## Consequences

- Future patch authorization has an auditable hosted/local record shape before patch writer work exists.
- Hosted and closed-local deployments share the same release-lock vocabulary.
- No patch authorization, app file write, patch generation, test execution, Playwright run, route mutation, scoring or reward mutation, audio manifest mutation, package promotion, assignment, or support-language progress exists.
