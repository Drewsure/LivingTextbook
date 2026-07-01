# ADR-0029: Teacher Report Export Readiness

Status: Accepted  
Date: 2026-07-02

## Context

Teacher reports are a core part of the Living Textbook white-label offer. MiniStar, school tenants, and textbook-publisher partners need teacher-visible progress summaries, but report export touches student data, retention, school policy, local/hosted deployment choices, and premium speech features.

The platform should show the report-export direction early without implying that raw classroom data can be exported before privacy and persistence decisions are accepted.

## Decision

Add a shared `TeacherReportExportPlan` contract to `packages/content-model/src/sessionSettings.ts` and render export readiness inside the teacher session monitor.

The scaffolded export plan is intentionally blocked until:

- launch sessions and progress events are persisted,
- school or tenant export policy is accepted,
- retention and access-control rules are chosen,
- report format and scope are approved for the tenant.

Core report export must exclude raw learner audio and learner transcripts. Those may only become available later under an explicit premium transcript/speech policy.

## Consequences

Positive:

- Makes teacher reporting saleable without prematurely choosing a backend.
- Keeps export behavior white-label and tenant-configurable.
- Protects the core platform from accidental raw audio or transcript export.
- Gives hosted PWA, local classroom server, and packaged local app deployments the same report contract.

Tradeoffs:

- The teacher monitor now shows one more expected scaffold warning.
- Real export remains deferred until policy, persistence, authentication, and storage are selected.
- Future export implementation must map this contract into real report generation rather than bypassing it.

## Verification

Use `docs/verification/TEACHER_REPORT_EXPORT_CHECKS.md`.

Routes:

- `http://127.0.0.1:3000/teacher/sessions/demo-unit-1`
- `http://127.0.0.1:3000/teacher/sessions/partner-demo-unit-1`

## Related Documents

- `docs/TEACHER_SESSION_SETTINGS_CONTRACT.md`
- `docs/verification/TEACHER_REPORT_EXPORT_CHECKS.md`
- `docs/decision-register/DR-030-teacher-report-export-readiness.md`
