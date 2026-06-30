# ADR 0013: Support-Only Assist Language

Status: Accepted

Date: 2026-06-30

## Context

MiniStar learners may need Japanese support, especially young learners who cannot yet read English confidently. Future white-label tenants may need a different assist language, or no assist language at all.

The platform must avoid a hidden shortcut where students advance by tapping support-language text instead of engaging the target learning language.

## Decision

Assist language is a comprehension support layer only.

For MiniStar English, English remains the progression trigger. For other tenants, the configured target learning language remains the progression trigger. Assist-language taps, glosses, audio, or translated instructions must not complete a learning step, unlock the next game, award mastery credit, or satisfy target-language item checks.

MiniStar Japanese assist has script rules:

- Foundation, Bronze, and Plus: student-visible Japanese assist must be hiragana-only.
- Silver and later: kanji and katakana may be introduced after review.
- Teacher/admin notes may use professional English or Japanese because they are not student-facing assist copy.

## Consequences

Positive:

- Young learners can receive support without weakening the mastery loop.
- The platform remains white-label because the rule is target-language based, not English-only.
- Early Japanese content is developmentally appropriate.
- Teacher reports can distinguish real progression from help usage later.

Tradeoffs:

- Imported or AI-drafted support language needs human review before assignment.
- Some publisher content may need rewriting into level-appropriate script bands.
- Future content-model fields should make progression role and script policy explicit rather than relying only on notes.

## Current Prototype

The MiniStar Level 1 Unit 1 sample uses hiragana-only Japanese assist text for vocabulary, target sentence glosses, and selected instruction/feedback support.

The current flashcard route does not emit progression events when assist text is tapped. The progression path remains flashcard entry practice completion -> Memory Match unlock -> game events -> progress summary.

## Follow-Up

Add explicit content-model fields for support-language progression role and script policy when the content-package review workflow is expanded. Those fields should be validated before packages become student-visible.
