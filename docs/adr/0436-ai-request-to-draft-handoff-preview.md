# ADR 0436: AI Request-To-Draft Handoff Preview

Status: Accepted

## Context

The teacher generator route now shows disabled request setup, cost gates, request packet previews, storage guards, draft JSON previews, verifier packets, package manifests, and writer readiness surfaces. The missing foundation was the transition boundary between a reviewed request packet and a draft preview.

Without a visible handoff, a future build session could accidentally treat a completed request packet as permission to call a model, bill the tenant, generate a draft, write draft JSON, submit to a verifier, or move toward package assembly.

## Decision

Add a review-only AI request-to-draft handoff preview to tenant generator routes.

The handoff links the reviewed `ai_generation_request_packet` to the target `ai_generated_draft_payload_preview` and names prompt package, premium AI cost gate, target-language audio requirement, activity compatibility, and media-rights lanes.

It keeps `handoff_mode: review-only-preflight`, `target_language_progress_trigger: target-language-only`, `support_language_progress_allowed: false`, `draft_creation_allowed: false`, and `draft_json_write_allowed: false`.

## Consequences

- Teachers and publishers can inspect the pre-draft evidence chain without activating a provider.
- AI provider choice remains portable.
- Model usage cost remains adult-controlled.
- MiniStar Japanese support remains hiragana-only, support-only, and unable to unlock progress.

## Non-Goals

This does not create model calls, billing, draft generation, draft writes, verifier submission, package assembly, route writes, playlist writes, student assignment, student-ready markers, or support-language progress.
