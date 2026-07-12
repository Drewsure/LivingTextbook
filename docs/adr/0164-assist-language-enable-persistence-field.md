# ADR 0164: Assist Language Enable Persistence Field

## Status

Accepted

## Context

Launch and front-door contexts now carry teacher session settings. Backend schema and migration previews still only referenced assist language generally, which could allow an implementation to omit the specific teacher enablement persistence rule.

## Decision

Add `assist_language_teacher_enablement_persisted` to backend schema and migration previews, and guard it through the teacher-session settings verifier.

## Consequences

- Hosted and local backend plans must preserve whether the teacher's support-language on/off choice is durable.
- The setting remains derived from the session settings snapshot, not a student action.
- Support-language visibility cannot be treated as loose package content during persistence design.
