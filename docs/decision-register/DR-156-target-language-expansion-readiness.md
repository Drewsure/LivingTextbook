# DR-156: Target Language Expansion Readiness

## Decision

Treat Japanese target-language support as a planned white-label expansion with its own gates, not as a side effect of MiniStar Japanese assist language.

## Rationale

Japanese assist copy helps MiniStar English learners. It does not solve Japanese curriculum, hiragana/katakana/kanji policy, furigana, Japanese audio, kana/kanji input, or language-aware segmentation.

## Accepted Direction

- Add a target-language expansion readiness plan.
- Show the plan on `/teacher/intake`.
- Add `npm run verify:target-language`.
- Include the check in `npm run verify:foundation`.
- Keep support-language taps unable to unlock progress.
- Block Japanese target-language pilots until segmentation, script policy, audio, input, and teacher review are resolved.

## Follow-Up

Before accepting a Japanese-learning tenant pilot, promote these sample gates into package manifests, language adapters, audio plans, and teacher review workflows.
