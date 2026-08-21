# DR-467: Report Package Settings Context Preview

## Status

Accepted.

## Decision

Teacher report package preview routes must show settings context before any future export workflow is considered.

The preview may show the active `game_mode_settings_profile_id`, `teacher_game_mode_settings_snapshot_id`, and report-only settings context rules. It must still keep export blocked, real learner data blocked, and settings-based scoring authority blocked.

## Rationale

The teacher session monitor now proves settings context at the event-envelope level. The report package preview also needs this visibility because it is the shape schools and publishers will eventually review before accepting export, retention, and reporting policy.

Showing settings context in the preview makes the future report audit trail easier to understand while preserving the rule that progress comes from target-language learning evidence, not support language, media playback, or settings toggles.

## Guardrails

- No report export action is enabled.
- Settings context is report-only evidence.
- Support-language progress, media-only progress, and scoring profile overrides remain blocked.
- Raw audio, transcripts, private identifiers, ungated AI Tutor state, and unreviewed notes remain outside the report package scaffold.

## Verification

- `npm run verify:foundation`
