# ADR 0160: Assist Language Session Settings Contract

## Status

Accepted

## Context

The teacher assist-language toggle proves the desired classroom control, but it is local browser state. A real launch session needs to preserve whether assist language was enabled or disabled so all student devices follow the same rule.

## Decision

Extend `TeacherSessionSettings.assistLanguage` with teacher-enable and persistence fields, and expose them in the teacher session settings snapshot.

## Consequences

- Assist-language visibility is treated as an explicit launch-session setting.
- The setting records whether teacher enablement is required and whether that enablement has been persisted.
- Teacher session warnings now flag unpersisted assist-language visibility before classroom use.
- The route verifier checks that the settings snapshot exposes the durable-setting field.
- Support-language taps remain support-only and cannot unlock progression or mastery.
