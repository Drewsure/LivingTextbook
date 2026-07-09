# DR-061: Sentence Builder Reporting Bridge

## Decision

Sentence Builder events are added to the sample teacher monitor stream using the existing shared progression event vocabulary.

## Rationale

Every playable game must participate in the same teacher-visible reporting model. Treating Sentence Builder as a normal progression event prevents game-specific reporting branches and keeps the white-label platform easier to extend.

## Consequences

- Teachers can see syntax-construction activity in the same sample monitor flow as flashcards, Memory Match, and Speak It.
- The text-spelling parent engine now has a reporting bridge before durable analytics are introduced.
- Future games must emit compatible events rather than inventing private score formats.

## Non-Goals

- Durable backend reporting.
- Export-ready classroom reports.
- AI-generated sentence assessment.
