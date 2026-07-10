# ADR 0084: Recommended Route Audio Controls

## Status

Accepted

## Context

The recommended game path is becoming the student's main progression surface. Young learners and English-language learners need audio support for those route labels and summaries, but nested buttons inside route links would create invalid interactive markup and confusing tap behavior.

## Decision

Render each recommended route as a card with a dedicated `Listen` control and a separate `Open` link. Locked cards show the same listen support but replace navigation with a non-interactive flashcard gate message.

## Consequences

Route guidance becomes audio-supported without changing progression rules. The card avoids nested interactive controls and keeps target-language activity completion as the unlock trigger.

