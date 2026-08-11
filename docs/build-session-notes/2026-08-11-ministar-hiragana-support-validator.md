# 2026-08-11 MiniStar Hiragana Support Validator

## Summary

Added a shared AI draft validator guard for early MiniStar Japanese support language.

## Changes

- `ja-hiragana` support cues must use `kind: support`.
- `ja-hiragana` support cues must be marked `support-only`.
- `ja-hiragana` support text must remain hiragana-only with reviewed punctuation.
- Foundation/Bronze/Plus Japanese support metadata must remain `support_language: ja-hiragana`.
- AI generator verification now checks the guard.

## Boundaries

- No generated draft is approved by this change.
- No live AI model call is introduced.
- No package, route, playlist, assignment, or student-ready marker is created.
- English remains the MiniStar early-level target-language progress trigger.

## Verification Target

Run AI generator verification, typecheck, and production build.
