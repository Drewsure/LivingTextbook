# Teacher Session Monitor Verification Checks

Document type: focused verification supplement  
Status: active scaffold  
Last updated: 2026-07-01

## Purpose

Verify that the teacher session monitor route presents a single report stream for launch state, target-language entry practice, game unlocks, media engagement, Training Academy recovery, Memory Match completion, and Speak It readiness without pretending that sample data is production persistence.

## Routes

Verify at:

- `http://127.0.0.1:3000/teacher/sessions/demo-unit-1`
- `http://127.0.0.1:3000/teacher/sessions/partner-demo-unit-1`

## Required Checks

1. Confirm the route renders a teacher session monitor heading.
2. Confirm the page shows launch code, visible student count, report event count, and reward metric.
3. Confirm the page states that the route uses sample data and needs persistence before live reporting.
4. Confirm the event stream includes target-language entry practice completion.
5. Confirm support-language taps do not appear as unlock triggers.
6. Confirm game unlock, media, recovery, game completion, and Speak It readiness events appear in one report stream.
7. Confirm microphone/speech scoring remains marked as disabled or record/replay-only in the core sample.
8. Confirm the page reuses tenant branding for MiniStar and the sample publisher.
9. Confirm the route contract for `/teacher/sessions/[launchCode]` is active scaffold, not future-only.
10. Confirm no real student identity, transcript, raw audio storage, or cloud speech scoring is implied.

## Acceptance Standard

The route should make the future teacher reporting surface tangible while preserving the current foundation rule: no production student monitoring before persistence, privacy, retention, access, and export rules exist.
