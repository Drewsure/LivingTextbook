# DR-525: Teacher Audio Request Evidence Lane

Status: Accepted

Date: 2026-08-29

## Decision

Show `audio_requested` in teacher session monitor and report package previews as a support-only learning-audio evidence lane.

## White-Label Impact

Positive. Schools and publishers can verify that learner-facing audio is being used without confusing audio support with mastery, score, or unlock authority.

## Cost Impact

Positive. A visible support-only lane reduces future reporting ambiguity and avoids expensive corrections if teachers expect audio taps to appear in reports.

## Constraints

- `audio_requested` may appear in teacher-visible monitor and report rows only as support-only evidence.
- Audio requests cannot unlock games, award mastery, change score values, or replace target-language answer/result events.
- Core report exports remain blocked until school policy, persistence, access control, and retention gates close.
