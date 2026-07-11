# Teacher Session Event Acceptance Gate Checks

## Scope

Run after teacher session monitor, live event storage, launch-session settings, report policy, event taxonomy, roster identity, microphone, AI Tutor, or media event changes.

## Checks

- Confirm `/teacher/sessions/demo-unit-1` shows `Event acceptance gate`.
- Confirm `/teacher/sessions/partner-demo-unit-1` shows `Event acceptance gate`.
- Confirm the gate blocks live student event storage when settings persistence is not ready.
- Confirm the gate blocks live student event storage when reporting/retention policy is not accepted.
- Confirm event taxonomy is shown as required before event writes.
- Confirm coded student identity remains a policy item before live pilot use.
- Confirm sensitive-data exclusions reject raw learner audio, transcripts, and ungated AI Tutor state.

## Verification Command

```powershell
npm run verify:foundation
```
