# Teacher Report Event Acceptance Summary Checks

## Scope

Run after teacher report package preview, event acceptance gate, live event storage, report export, backend schema, or pilot handoff work.

## Checks

- Confirm `/teacher/sessions/demo-unit-1/report-package` shows `Event acceptance summary`.
- Confirm `/teacher/sessions/partner-demo-unit-1/report-package` shows `Event acceptance summary`.
- Confirm the summary shows event gate status, blocked count, warning count, evidence, and next steps.
- Confirm report package export remains blocked while event acceptance, report policy, persistence, retention, access, or sensitive-data rules are unresolved.
- Confirm support-only media, support-language, and route-guidance signals still do not unlock progress or mastery.
- Confirm raw learner audio, transcripts, ungated AI Tutor state, and private identifiers remain outside the core report package.

## Verification Command

```powershell
npm run verify:foundation
```
