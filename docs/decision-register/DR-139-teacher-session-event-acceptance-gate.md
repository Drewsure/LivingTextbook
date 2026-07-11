# DR-139: Teacher Session Event Acceptance Gate

## Decision

Add an event acceptance gate to teacher session monitor routes.

## Reason

The platform must not confuse demo event playback with permission to store real student data. A live session can only accept student events when settings persistence, policy, audio coverage, event taxonomy, identity, and sensitive-data exclusions are ready.

## Standard

- `/teacher/sessions/demo-unit-1` and `/teacher/sessions/partner-demo-unit-1` show `Event acceptance gate`.
- The gate blocks live event storage while launch-session settings persistence or report policy remain open.
- The gate confirms event-effect taxonomy exists before live event writes.
- The gate confirms raw audio, transcripts, and ungated AI Tutor state stay outside core event storage.
- The gate keeps support-only events out of mastery, Star Dust, and unlock calculations.
