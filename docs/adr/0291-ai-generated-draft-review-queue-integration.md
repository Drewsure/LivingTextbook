# ADR 0291: AI-Generated Draft Review Queue Integration

Status: Accepted  
Date: 2026-07-31

## Decision

Add AI-generated draft package previews to the standard teacher draft review queue as read-only queue items.

AI-generated drafts must show source lineage, verifier packet requirements, target-language audio blockers, media-rights blockers, engine and gamification checks, route and playlist creation blocks, assignment blocks, and approval blocks before any generated package can move toward live review.

## Rationale

The AI teaching game generator should save authoring time, but it must not create a separate fast lane that bypasses human review. A shared review queue keeps teacher-created drafts and AI-generated drafts under one process, which is easier to explain to schools and cheaper to maintain.

## Consequences

- AI-generated drafts use the same `teacher_draft_package` and review queue preview surfaces as teacher drafts.
- AI-generated drafts cannot be submitted to a live verifier, approved, routed, playlisted, assigned, or marked student-ready from the preview.
- The review queue now exposes AI-specific source lineage, verifier preflight, evidence, and audit-trail blockers.
