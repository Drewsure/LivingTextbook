# DR-063: Quiz Reporting Bridge

## Decision

Add Quiz events to the sample teacher monitor stream using the shared game progress event vocabulary.

## Rationale

Playable games must become teacher-visible through the same reporting model. Quiz is the first playable selection-engine route, so it should establish the reporting path for later arcade selection modes.

## Consequences

- Teachers can see Quiz completion in the same event stream as other game slices.
- The sample Star Dust total remains capped at 1,000 for the unit.
- Future selection skins should reuse the Quiz reporting metadata shape.

## Non-Goals

- Stored assessment grades.
- Exportable reports.
- High-stakes testing.
