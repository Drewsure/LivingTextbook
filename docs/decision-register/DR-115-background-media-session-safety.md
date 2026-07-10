# DR-115: Background Media Session Safety

## Decision

Represent background media safety in the shared teacher session settings model, not only in UI copy.

## Reason

Teacher-controlled background music or chant audio must be enforced where classroom sessions are configured. If the rule only lives in documentation, future games could accidentally let background media mask tap-to-speak audio or count as progress.

## Standard

- `TeacherSessionSettings.backgroundMedia` must state whether background media pauses, ducks, or mutes for learning audio.
- Background media cannot unlock games or progression.
- Background media cannot award mastery credit.
- Session settings validation blocks unsafe background media configurations.
- Teacher session pages must explain this rule before classroom use.

