# DR-398: MiniStar Hiragana Support Validator

Date: 2026-08-11

Status: Accepted

## Decision

Enforce early MiniStar Japanese support-language safety inside the shared AI generated draft payload validator.

## Rationale

The AI teaching game generator will eventually create draft packages from reviewed source material. MiniStar early-level support Japanese must remain helpful, readable, and non-scoring before any live model call or package writer exists. A shared validator is the cheapest and safest place to block corrupted support text, kanji/katakana drift, or support-language cues that could be mistaken for progress evidence.

## Impact

- Early Japanese support metadata must use `support_language: ja-hiragana`.
- `ja-hiragana` support cues must use `kind: support`.
- `ja-hiragana` support cues must be marked `support-only`.
- `ja-hiragana` support text must be hiragana-only with reviewed punctuation.
- The AI generator verifier now checks that this guard remains in place.

## Constraints

- This does not approve any generated draft.
- This does not create a live model call, route, playlist, assignment, package writer, or student-ready marker.
- English remains the target-language progress trigger for the MiniStar early-level sample.
- Support language remains comprehension support only.

## Verification

- `npm.cmd run verify:ai-generator`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
