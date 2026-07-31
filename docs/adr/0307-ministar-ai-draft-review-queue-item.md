# ADR 0307: MiniStar AI Draft Review Queue Item

Status: Accepted  
Date: 2026-07-31

## Decision

Add the MiniStar Level 1 AI-generated greetings draft to the standard teacher draft review queue as a read-only queue item.

The queue item exposes source lineage, verifier requirements, English audio blockers, hiragana-only Japanese support review, media-rights blockers, reviewer decision previews, evidence packet requirements, audit trail previews, and blocked student-facing actions.

## Rationale

Generated content must not have a privileged path around teacher review. The MiniStar generator now has draft, correction, verifier, and manifest evidence, so the normal review queue should show how that generated package would be inspected before any package approval or student route exists.

## Consequences

- `/teacher/review` now shows a MiniStar AI-generated draft alongside the existing sample-publisher draft.
- MiniStar support-language review is visible in the verifier preflight.
- Submit verifier, approve package, create route, create playlist, assign students, and mark student-ready actions remain blocked.
- No live review state, upload, approval, or audit storage is enabled.
