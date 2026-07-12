# DR-160: Assist Language Session Settings Contract

## Decision

Represent assist-language visibility as a teacher session setting that must persist with the launch session before classroom use.

## Rationale

Support language is teacher-controlled. If that choice stays only in local browser state, different student devices could see different rules. The launch-session settings contract needs to preserve both enabled and disabled choices before live use.

## Accepted Direction

- Add teacher enablement and persistence fields to assist-language session settings.
- Show those fields in the teacher session settings snapshot.
- Warn while assist-language visibility is not persisted.
- Keep assist-language activity non-scoring, non-unlocking, and separate from target-language progress.

## Follow-Up

Move the settings snapshot into the selected hosted or local persistence adapter before real classroom pilots.
