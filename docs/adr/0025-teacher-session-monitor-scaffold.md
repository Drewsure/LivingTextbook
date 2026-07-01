# ADR 0025: Teacher Session Monitor Scaffold

Date: 2026-07-01  
Status: Accepted

## Context

The platform now has sample student routes, front-door routes, Training Academy recovery events, media engagement events, Speak It practice, and local teacher summary concepts. A white-label pilot will need a teacher-visible session monitor, but production monitoring depends on persistence, privacy, retention, export, and access-control rules that are not ready yet.

## Decision

Add an active scaffold route at `/teacher/sessions/[launchCode]`. The route uses sample data and a shared event stream to show how launch state, target-language entry practice, game unlocks, media events, Training Academy recovery, Memory Match completion, and Speak It readiness can appear in one teacher monitor.

The route is explicitly sample/local. It does not store real student data, transcripts, raw audio, or production reports.

## Consequences

- Teachers and partners can see the intended reporting direction earlier.
- The route reuses the current `GameProgressEvent` stream rather than creating a separate reporting model too soon.
- The build exposes what must become durable before a real pilot: launch sessions, progress/media events, teacher toggles, student/session policy, and export controls.
- The route can prove MiniStar and partner tenant rendering before deeper backend work begins.

## Guardrails

- Do not treat this route as production analytics.
- Do not store or imply storage of real student identity, transcript, or raw audio.
- Do not allow support-language activity to satisfy unlock or mastery requirements.
- Do not activate premium AI Tutor, cloud speech recognition, or pronunciation scoring through this route.
- Persisted reporting must wait for DR-025 persistence boundary follow-up work.
