# ADR-0037: Class Roster Identity Boundary

Date: 2026-07-02

## Status

Accepted

## Context

Living Textbook needs QR entry, user-code entry, teacher reports, local/closed deployment options, and white-label textbook companion support. Those needs create pressure to add student accounts early, but full authentication, school rosters, and durable learner records would force backend, privacy, consent, retention, and export decisions before the classroom slice is stable.

## Decision

Use a lightweight class roster contract for the foundation layer. The preferred early identity mode is teacher-issued learner codes. Anonymous practice remains valid for demos and preview. School-roster ids and family-managed identities are future modes that require policy and persistence decisions.

The roster contract explicitly excludes real names, family contacts, raw microphone audio, and speech transcripts from the core foundation layer.

## Consequences

- Teacher reports can be previewed without building production authentication immediately.
- White-label partners can see how textbook user codes and local classroom codes will work.
- Durable history remains blocked until persistence and policy are accepted.
- AI Tutor and speech features cannot quietly store audio or transcripts as roster data.
- Closed/local deployment must still define backup, restore, export, and update procedures.

## Verification

Use `docs/verification/CLASS_ROSTER_READINESS_CHECKS.md` after pulling the connector-side changes locally.
