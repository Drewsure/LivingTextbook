# ADR 0435: AI Generation Request Packet Preview

Status: Accepted

Date: 2026-08-25

## Context

The AI generator route has a disabled request builder and a storage guard. After adding the backend-neutral request packet storage contract, the teacher/admin route needed a readable packet preview that mirrors the actual evidence links and blocked actions.

## Decision

Add a guarded `AiGenerationRequestPacketPreviewPanel` backed by tenant sample data and a shared content-model validator. The panel appears in the generator request setup section between the disabled request builder and the request storage guard.

The preview shows evidence links for request-builder review, source evidence, premium AI cost gate, target-language audio coverage, activity compatibility, media rights, teacher draft package, and verifier submission. It keeps live model dispatch, model billing, draft generation, verifier submission, package assembly, route writes, playlist writes, assignments, student-ready markers, and support-language progress blocked.

## Consequences

- Teachers and publishers can see what the request packet will contain before backend work begins.
- The route remains review-only and child-safe.
- MiniStar and sample-publisher tenants share the same request packet vocabulary.
- Future live AI provider work has a clearer preflight surface.
