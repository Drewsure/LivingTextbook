# 0383. AI generated package teacher review packet storage contract

Date: 2026-08-11

## Status

Accepted

## Context

The generator route now shows a review-only teacher approval prep packet. Hosted and closed-local deployments need a shared record vocabulary before that packet can be persisted, exported, restored, or connected to future approval workflows.

## Decision

Add `ai_generated_package_teacher_review_packet` / `ai-generated-package-teacher-review-packet` to the schema draft, migration candidates, migration specs, durable records, hosted/local adapter intents, content-model validators, and route verification.

The record preserves teacher decision lanes, ready signals, missing evidence, blocked actions, next required records, target-language audio approval needs, media-rights evidence needs, teacher approval ledger needs, release-control binding needs, and assignment rollout needs.

## Consequences

- Hosted and local deployments use the same generated-package approval-prep vocabulary.
- Teacher approval capture remains blocked until a separate approval workflow and identity/evidence rules exist.
- Generated package assembly, route writes, playlist writes, assignment writes, local bundle writes, student-ready markers, and support-language progress triggers remain blocked.
- MiniStar keeps English target-language audio as the approval trigger and Foundation Japanese support hiragana-only and support-only.
