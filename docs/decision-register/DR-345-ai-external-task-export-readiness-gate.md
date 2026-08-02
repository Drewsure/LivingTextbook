# DR-345: AI External Task Export Readiness Gate

Date: 2026-08-02

## Decision

Add a review-only external task export readiness gate after the external prototype task packet.

## Why

The platform needs to make future outside-builder handoffs practical without accidentally enabling them. The gate shows what is missing before prompt copy, repository issue creation, archive export, or handoff workflows can exist.

## Blocks

- No task export.
- No prompt copy action.
- No repository issue creation.
- No archive download.
- No live handoff.
- No app file writes.
- No route creation.
- No scoring authority.
- No student-facing pathway.
- No support-language progress.

## Required Before Future Export

- Reviewer identity and signature gate.
- Evidence storage.
- Durable task packet storage.
- External builder repository policy.
- Return-review intake.
- Codex owner confirmation.
