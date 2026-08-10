# ADR 0372: AI Prototype Codex Patch Approval Decision

Date: 2026-08-10

## Status

Accepted

## Context

The generator route now shows prototype patch proposals, patch test readiness gates, patch test harness plans, and patch harness implementation proposals. The next foundation step is a visible manual Codex approval decision preview that separates evidence review from actual app patch approval.

## Decision

Add review-only AI prototype Codex patch approval decision previews to tenant generator routes after patch harness implementation proposals.

The preview names patch scope review, patch test readiness review, harness plan review, harness implementation proposal review, route safety, rollback, storage verification, reviewer identity signature, decision options, and blocked actions.

## Consequences

- Future prototype patch work has a manual approval checkpoint before app files can be touched.
- Reviewers can see whether a prototype is blocked, returned for evidence repair, rejected, or eligible for planning-only approval.
- No patch approval is recorded until a future storage contract and signed approval workflow exist.
- App file writes, patch generation, test execution, Playwright runs, route mutation, student-facing routes, scoring or reward mutation, audio manifest mutation, package promotion, assignment, and support-language progress remain blocked.
- MiniStar approval decisions must preserve hiragana-only Japanese support and support-only progression while English remains the trigger.
