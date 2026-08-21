# DR-468: Report Package Settings Context Storage

## Status

Accepted.

## Decision

Teacher report package storage contracts must preserve `settings_context_summary` alongside `event_acceptance_summary`.

Hosted and local report package write intents, durable records, backend schema drafts, migration candidates, and migration specs must all keep settings context summaries before any report export, local report handoff, or teacher-facing report package storage can be considered.

## Rationale

Report package previews already show settings context as report-only evidence. Future export or storage work must not drop that context, because teachers and schools need to understand which reviewed game-mode settings profile and teacher settings snapshot were active when interpreting event rows.

The stored summary is interpretive context only. It does not create scoring authority and cannot turn support language, media playback, timer settings, or scoring profile overrides into mastery evidence.

## Guardrails

- Report export remains blocked.
- Settings context summaries are required report-package storage evidence.
- Settings context summaries cannot grant mastery, Star Dust, unlocks, or scoring changes.
- Support-language progress, media-only progress, and scoring profile overrides remain blocked.
- Raw learner audio, transcripts, private identifiers, ungated AI Tutor state, and unreviewed notes remain outside the report package scaffold.

## Verification

- `npm run verify:backend-storage`
- `npm run verify:foundation`
