# ADR 0348: AI Prototype Patch Test Readiness Gate

Status: accepted

## Context

App patch proposals identify future file scope, but a future file-change workflow also needs test readiness before any generated or returned prototype can move toward `apps/web` edits.

## Decision

Add a review-only AI prototype patch test readiness gate to teacher generator routes after the app patch proposal.

The gate names fixture replay, event replay, target-language audio, mobile accessibility, deterministic scoring, route safety, storage contract, rollback, and support-language boundary checks. It does not execute tests or write files.

## Consequences

- Future patch planning has a visible test checklist before test harness work exists.
- App file writes, route mutations, scoring or reward mutation, audio manifest mutation, package promotion, assignments, and support-language progress remain blocked.
- MiniStar patch tests must prove early Japanese support remains hiragana-only and support-only.
