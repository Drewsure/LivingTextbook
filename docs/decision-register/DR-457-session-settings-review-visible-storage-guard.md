# DR-457: Session Settings Review Visible Storage Guard

Date: 2026-08-15

## Decision

Launch-session persistence validators and the teacher intake persistence panel must expose the settings review packet as a required preserved artifact.

## Rationale

The review packet is not only documentation. It is the evidence that teacher settings were checked for target-language progression, assist-language limits, microphone policy, AI Tutor cost/package rules, background-media priority, reporting boundaries, and blocked live actions.

Showing it in the adapter readiness UI helps non-technical reviewers see that hosted and local storage have the same responsibility before any live classroom workflow exists.

## Consequences

- Launch-session adapter write intents fail validation if they omit `preservesTeacherSessionSettingsReviewPacket`.
- Launch-session durable records fail validation if they omit `preservesTeacherSessionSettingsReviewPacket`.
- `/teacher/intake` shows `Settings review packet` in persistence readiness.
- Route verification guards the visible UI marker.

## Non-Goals

- No live setting save is enabled.
- No backend vendor is selected.
- No student data storage is activated.
