# ADR 0167: Class Roster Readiness Verifier

Date: 2026-07-12

## Status

Accepted

## Context

The platform needs teacher-issued learner codes, front-door entry, teacher reports, and local/closed deployment support without drifting into premature student accounts or personal-data storage. The class roster contract and panels existed, but they were not part of the master foundation command.

## Decision

Add `npm run verify:class-roster` and include it in `npm run verify:foundation`.

The verifier protects three sample roster plans, coded learner slots, roster data boundaries, front-door copy, teacher session roster cards, backend storage previews, and the hard rule that real names, family contact, raw audio, and speech transcripts are not core roster fields.

## Consequences

Roster, teacher-report, front-door, microphone, AI Tutor speech, local deployment, and backend storage changes now have an automated foundation guard. Pilot-ready roster claims remain blocked until policy, persistence, retention, export, and data-removal rules are accepted.
