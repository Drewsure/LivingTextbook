# ADR 0434: AI Generation Request Packet Storage Contract

Status: Accepted

Date: 2026-08-25

## Context

Teacher generator routes already show disabled request builders and storage guards. The missing foundation was a first-class backend-neutral record for the reviewed request packet itself. Without that contract, future work could accidentally treat a UI guard as enough to call a model, estimate cost, create drafts, or move toward student-facing package work.

## Decision

Add `ai_generation_request_packet` / `ai-generation-request-packet` as a durable storage category, schema draft entity, migration candidate, migration spec, hosted write intent, local write intent, and verification target.

The record preserves request-builder review, source evidence, premium AI cost gate, target-language audio coverage, activity compatibility, media-rights manifest, draft-package, and verifier-submission links. It blocks generator request submission, live model dispatch, model billing, draft generation, verifier submission, generated package assembly, route writes, playlist writes, assignments, student-ready markers, and support-language progress triggers.

## Consequences

- The AI generator remains review-first and cost-controlled.
- Local classroom and hosted deployments share the same record vocabulary.
- Future AI model/provider work has a clear integration point.
- Teacher-facing generator UI can continue to improve without enabling live AI or billing.

## Verification

The backend storage verifier must check the schema, migration candidate, migration spec, durable record plan, adapter plan, content-model validators, and active route visibility for this record.
