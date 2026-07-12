# Target Language Expansion Contract

Document type: foundation contract

Related:

- `docs/ASSIST_LANGUAGE_STANDARD.md`
- `docs/COMPETITIVE_FEATURE_COVERAGE_MATRIX.md`
- `docs/FUTURE_REQUIREMENTS.md`
- `docs/PRINCIPLES_AND_STANDARDS.md`
- `docs/verification/TARGET_LANGUAGE_EXPANSION_CHECKS.md`

## Purpose

This contract keeps white-label language expansion separate from assist-language support.

MiniStar Japanese assist helps Japanese-speaking children understand MiniStar English. It does not mean the platform is ready to teach Japanese as the target learning language.

## Core Rule

Assist language is not target language.

For MiniStar English:

- English is the target learning language.
- English controls mastery and progression.
- Japanese may support comprehension.
- Japanese support taps never unlock games, award mastery, or complete target-language checks.

For a future Japanese-learning tenant:

- Japanese becomes the target learning language.
- Japanese controls mastery and progression.
- English or another language may become assist support.
- Japanese package data must be reviewed as curriculum, not treated as translation output.

## Readiness Lanes

The current foundation plan tracks these lanes:

- Target language configuration: target language, UI language, and assist languages must be separate.
- Japanese script policy: hiragana, katakana, kanji, and optional furigana/ruby display require level-aware review.
- Segmentation policy: Japanese games cannot rely on English-only whitespace splitting.
- Audio and pronunciation: Japanese learner text needs reviewed native audio, approved TTS, or a selected speech provider.
- Kana and kanji input: typing modes need IME-safe input, normalization, and accepted-answer policy.
- Handwriting and stroke order: useful later, but optional and not a v1 blocker.

## Pilot Blockers

A Japanese target-language pilot remains blocked until these are resolved:

- explicit package-level target-language trigger,
- reviewed Japanese curriculum package,
- furigana/ruby rendering where required,
- language-aware segmentation for text-spelling and sentence modes,
- Japanese audio cue policy,
- typing/input normalization policy,
- teacher or tenant approval workflow.

## Current Implementation

The visible planning gate is shown on `/teacher/intake`.

The sample data lives in `apps/web/src/data/sampleTargetLanguageExpansionPlan.ts`.

The focused verifier is `npm run verify:target-language`, and it is included in `npm run verify:foundation`.

## Acceptance Standard

Future language expansion work must preserve:

- target-language progress gates,
- assist-language support-only behavior,
- tenant-configurable language settings,
- reviewed audio and script policy,
- language-aware tokenization,
- teacher review before assignment.

No future agent should present Japanese assist support as a completed Japanese-learning product.
