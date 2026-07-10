# ADR 0112: First Pilot Source Strategy

## Status

Accepted

## Context

The white-label product must support publisher PDF onboarding, but the first partner pilot should not depend on fragile PDF extraction, OCR cleanup, or automatic AI-generated student content.

## Decision

Use manually reviewed partner unit data for the first pilot. Keep draft PDF import as a reviewed intake path after source-review queues, verifier gates, source hashes, and rollback rules are persisted. Block automatic PDF-to-student publishing.

## Consequences

- The first pilot can prove games, media, routes, reports, and package gates sooner.
- Publisher onboarding remains practical without promising unsafe automation too early.
- Future PDF import work must produce reviewable drafts, not direct student assignments.

