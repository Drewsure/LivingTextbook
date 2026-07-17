# ADR 0275: Class Roster Plan Storage Contract

Date: 2026-07-17

Status: accepted

## Context

Class roster identity already supports teacher-issued codes, session previews, teacher reports, and front-door entry flows. The platform now needs a durable storage vocabulary for roster plans before any real pilot, local classroom deployment, school roster import, family account path, report export, microphone reporting, or AI Tutor reporting can be promised.

## Decision

Add `class_roster_plan` / `class-roster-plan` as a backend-neutral storage contract.

The contract preserves tenant/package/launch binding, roster readiness, identity mode, coded learner slots, data boundaries, progress-summary allowance, and pilot blockers. It blocks real learner names, family contact, raw audio, transcripts, production account creation, and report export.

## Consequences

- Teacher-led QR onboarding can support coded learner slots without creating premature student accounts.
- Hosted and closed/local deployments share the same class roster vocabulary.
- Report surfaces can continue showing demo-safe progress summaries while live export remains blocked.
- Speech practice and future AI Tutor features cannot write raw audio or transcripts into the roster layer.
- School roster integrations and family-managed identities remain future work gated by policy, persistence, retention, and reporting decisions.
