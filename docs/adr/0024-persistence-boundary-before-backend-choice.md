# ADR 0024: Persistence Boundary Before Backend Choice

Date: 2026-07-01  
Status: Accepted

## Context

The current Living Textbook build proves student progression, route resolution, content package review concepts, multimedia events, Training Academy recovery, Speak It practice, teacher session settings, and teacher-visible summaries using static sample data and local state. A real white-label pilot needs durable records, but choosing a backend too early can increase cost, lock in the wrong deployment shape, and complicate closed/local partner deployments.

## Decision

Add a persistence boundary scaffold before selecting a production backend. The scaffold names which records can remain static for demos and which records must become durable before pilot use:

- tenant configuration,
- reviewed content packages,
- front-door and permanent QR registry,
- teacher launch sessions and teacher session settings,
- progress and media event stream,
- media manifest and rights records,
- deployment profile records,
- report export and retention policy records.

Add a shared durable-record contract in `packages/content-model/src/persistenceRecords.ts` and render a sample durable record map in `/teacher/intake`. The record map separates safety errors from pilot-readiness warnings and keeps raw learner audio and learner transcripts out of core storage.

The first pilot recommendation is a hosted managed database because it is the most practical path for QR registries, launch sessions, teacher reports, and admin review. Local-first storage remains a planned path for closed classroom or packaged textbook companion deployments.

## Consequences

- The product remains cost-conscious and backend-agnostic during foundation work.
- The team can discuss persistence with partners without pretending demo-local data is production-ready.
- Privacy, retention, export, and school policy must be resolved before storing real student progress events.
- Teacher toggles such as microphone approval must eventually move from browser-local state into launch/session records.
- The durable record map gives future backend work a named target before choosing a vendor.
- Local/closed deployments still require sync/export, backup, update, and QR/deep-link fallback decisions.

## Guardrails

- Do not store real student data until privacy, retention, access, export, and school/parent policy are decided.
- Do not store raw learner audio or learner transcripts in the core persistence scaffold.
- Do not hard-code a single backend into domain models.
- Do not make hosted PWA storage assumptions that block local classroom or packaged app deployments.
- Do not treat AI Tutor usage, speech recognition, audio upload, or transcript storage as part of the core persistence requirement.

## Verification

Use `docs/verification/PERSISTENCE_BOUNDARY_CHECKS.md` and verify:

- `http://127.0.0.1:3000/teacher/intake`
- the durable record map,
- safety errors vs pilot-readiness warnings,
- local/closed deployment visibility,
- no raw audio/transcript storage in core records.
