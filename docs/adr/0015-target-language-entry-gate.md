# ADR 0015: Target-Language Entry Gate

Status: Accepted

Date: 2026-07-01

## Context

The flashcard entry practice now includes both target learning language text and optional assist-language support. This is essential for young learners, but it creates a platform risk: a student could appear to progress by tapping only support-language text, then manually completing entry practice.

That would weaken the mastery loop, teacher reporting, and white-label product promise.

## Decision

Entry-practice completion must be gated by target-language engagement.

For the current MiniStar sample, the target language is English. Students must tap/hear the target-language vocabulary terms and target sentence structures before the entry practice can be completed and before Memory Match can unlock.

Assist-language text, including Japanese support, remains clickable and speakable, but it must not increment the target-language practice count, complete flashcards, unlock the next game, award Star Dust, or satisfy mastery checks.

The gate applies to both:

- direct teacher QR launch route, `/launch/[code]`
- front-door textbook route, `/enter/[tenantId]`

## Implementation Notes

- `AudioCueText` supports an optional explicit `onPlay` callback.
- Only target-language vocabulary terms and target-language sentence structures pass that callback.
- Assist-language glosses do not pass the callback.
- `FlashcardPracticeCard` displays the target-language count as `English listened: X/Y` in the MiniStar sample.
- The completion action stays disabled until the target-language count reaches the required count.
- Completion events record target-language engagement metadata and explicitly mark `supportLanguageUnlockAllowed: false`.

## Consequences

Positive:

- Young learners can use Japanese help without bypassing English practice.
- Teacher reports can later distinguish learning progression from support usage.
- White-label tenants can map the same rule to their own target language and assist languages.
- The route contract is consistent across QR launches and front-door launches.

Tradeoffs:

- Students must touch each target item at least once in the entry slice.
- Future tenants with non-English target languages need labels that say the correct target-language name instead of hard-coded English wording.
- Future media/audio telemetry should separately track assist-language usage for teacher insight without converting it into mastery credit.

## Verification

For `/launch/demo-unit-1` and `/enter/ministar`:

1. Refresh the route to start with a clean local session.
2. Tap only Japanese assist text.
3. Confirm the target-language count remains unchanged.
4. Confirm the completion action remains disabled.
5. Confirm Memory Match remains locked.
6. Tap every target-language vocabulary term.
7. Tap both target-language sentence structures.
8. Confirm the target-language count reaches the required count.
9. Confirm the completion action becomes available.
10. Complete entry practice.
11. Confirm Memory Match unlocks only after that target-language gate is satisfied.
