# DR-077: Teacher Assignment Game Audio Coverage

## Decision

Add audio-covered game mode metadata to teacher assignment plans and surface it beside assigned game paths.

## Rationale

Teacher assignments are the bridge between reviewed packages and classroom launches. They should show whether assigned game modes have reviewed audio coverage before a teacher relies on them.

## Consequences

- Assignment plans now carry `audioCoveredGameModes`.
- The assignment panel shows audio-covered count and labels each target mode as audio-covered or needing review.
- Ready-for-pilot assignment validation blocks target modes without audio coverage.

## Non-Goals

- Backend writes.
- Raw audio storage.
- New game implementation.
- Premium polish.
