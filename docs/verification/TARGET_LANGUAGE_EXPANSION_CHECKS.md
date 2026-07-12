# Target Language Expansion Checks

Run:

```powershell
npm run verify:target-language
```

Expected result:

- The target-language readiness plan includes target language configuration.
- Japanese script policy is present.
- Segmentation policy is blocked until language-aware tokenization exists.
- Audio and pronunciation readiness is present.
- Kana and kanji input readiness is present.
- Handwriting and stroke order are optional, not v1 blockers.
- Assist language remains separate from target language.
- The active route verifier checks `/teacher/intake` for target-language expansion text.

Manual review:

- Open `http://127.0.0.1:3000/teacher/intake`.
- Confirm the Target language expansion panel is visible.
- Confirm it says assist language is not target language.
- Confirm Japanese pilot blockers are visible.
- Confirm furigana rendering and segmentation policy are not presented as complete.
- Confirm the panel does not imply MiniStar Japanese assist is enough for Japanese target-language teaching.
