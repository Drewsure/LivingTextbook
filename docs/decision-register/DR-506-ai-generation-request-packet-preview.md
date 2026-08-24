# DR-506: AI Generation Request Packet Preview

Status: Accepted

Date: 2026-08-25

## Decision

Teacher generator routes must show a review-only AI generation request packet preview before live model calls, model billing, draft generation, verifier submission, package assembly, route writes, playlist writes, student assignments, student-ready markers, or support-language progress can exist.

## Rationale

The storage contract defines the backend object. The teacher/admin route also needs a readable preview of that same object so reviewers can see the evidence links, progress boundaries, and blocked actions before any live AI workflow is built.

This keeps the generator understandable to nontechnical school and publisher users while preserving Codex control over architecture, verification, cost gates, and student-facing release.

## Constraints

- The preview is not a live prompt dispatch surface.
- The preview cannot estimate real cost, generate drafts, submit to a verifier, write routes, create playlists, or assign students.
- Target-language progress remains the only scoring trigger.
- Support-language text, audio, taps, or media remain support-only.
- MiniStar early Japanese support remains hiragana-only and cannot unlock progress.

## Verification

- `npm run verify:ai-generator`
- `npm run verify:routes`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web`
