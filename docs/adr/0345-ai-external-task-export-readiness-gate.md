# ADR 0345: AI External Task Export Readiness Gate

Status: accepted

## Context

AI external prototype task packets are copy-ready previews, but a future export or handoff path needs stronger gates before any prompt copy, repository issue, archive download, or outside-builder handoff exists.

## Decision

Add a review-only AI external task export readiness gate to the teacher generator route.

The gate shows blocked export channels, source records, readiness checks, and blocked actions. It requires reviewer identity, evidence storage, task packet storage, external-builder repository policy, return-review intake, and Codex owner confirmation before any future export workflow is considered.

## Consequences

- Copy-ready task packets remain useful without becoming live work orders.
- Future Z.ai or outside-builder handoff will have a visible checklist before tooling exists.
- Repository issue creation, prompt copy, archive download, app writes, routes, scoring authority, and student-facing paths stay blocked.
- MiniStar support-language progress remains blocked.
