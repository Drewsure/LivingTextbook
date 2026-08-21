# Teacher Report Package Event Acceptance Storage Checks

## Scope

Run after teacher report package, report export, event acceptance, backend schema, migration specs, hosted backend, or local classroom storage work.

## Checks

- Confirm teacher report package write intents preserve event acceptance summaries.
- Confirm teacher report package durable records preserve event acceptance summaries.
- Confirm teacher report package write intents preserve settings context summaries.
- Confirm teacher report package durable records preserve settings context summaries.
- Confirm backend schema draft teacher report packages include `event_acceptance_summary` and `settings_context_summary`.
- Confirm migration specs include `event_acceptance_summary` and `settings_context_summary` in `spec-teacher-report-package`.
- Confirm report package storage rejects raw learner audio, transcripts, ungated AI Tutor state, and private identifiers.
- Confirm support-only events cannot become mastery, Star Dust, or unlock evidence in stored report packages.
- Confirm report export remains blocked until event acceptance, policy, persistence, retention, access, and format rules are accepted.

## Verification Command

```powershell
npm run verify:foundation
```
