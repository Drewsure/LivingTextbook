# ADR 0304: MiniStar Draft JSON Correction Queue

Status: Accepted  
Date: 2026-07-31

## Decision

Add a review-only MiniStar Draft JSON preview for the Level 1 greetings generator request and allow the existing AI draft correction queue to derive MiniStar repair lanes from it.

The preview includes 8 default vocabulary terms, exactly 2 target sentences, target-language-only progress policy, required English audio cues, hiragana-only Japanese support metadata, blocked draft actions, and next required records.

## Rationale

The AI teaching game generator needs a concrete MiniStar output shape before verifier packets, manifests, publish readiness, or live model calls are built. Showing the draft and its correction queue lets reviewers judge the schema, audio, progress, and support-language boundaries without creating student-facing work.

This also keeps MiniStar as the flagship tenant while preserving white-label separation: the draft belongs to the MiniStar request and does not inherit sample-publisher readiness.

## Consequences

- `/teacher/generator/ministar` now shows a MiniStar Draft JSON preview.
- The MiniStar correction queue is derived from shared validation output.
- English remains the target-language progress trigger.
- Japanese support remains hiragana-only and cannot unlock progress.
- Target-language audio remains required but not approved.
- Verifier submission, generated package manifest, publish readiness, route creation, playlist creation, and student assignment remain blocked.
