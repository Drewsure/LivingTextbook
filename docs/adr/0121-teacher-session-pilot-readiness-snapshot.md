# ADR 0121: Teacher Session Pilot Readiness Snapshot

## Status

Accepted

## Context

Teacher session pages now show preflight, settings, lifecycle controls, media engagement, and report export readiness. The page still needed a top-level summary that separates demo-safe monitoring from live pilot readiness.

## Decision

Add a derived pilot readiness snapshot to the teacher session monitor context and render it near the top of the teacher session page.

## Consequences

- Teacher/admin reviewers can see live-use blockers quickly.
- The page avoids implying that demo event streams are production reporting.
- Future persistence can reuse the derived snapshot rules when session records become durable.

