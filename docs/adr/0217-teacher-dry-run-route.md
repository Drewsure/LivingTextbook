# ADR 0217: Teacher Dry-Run Route

Date: 2026-07-15

## Status

Accepted

## Context

The teacher dry-run rehearsal is visible on `/teacher/intake`, but the intake page is a large admin surface. A pilot partner needs a focused route a teacher can open during a controlled pre-classroom rehearsal.

## Decision

Add `/teacher/dry-run/sample-publisher-first-handoff-teacher-dry-run` as a preview-only teacher dry-run workspace.

The route renders the same rehearsal contract as the intake page and provides route shortcuts for the teacher-only pass. It does not schedule a class, create an assignment, collect real learner data, store live progress, export reports, or approve a pilot.

## Consequences

- Teachers get a focused pre-classroom rehearsal page.
- Active route verification now checks 40 routes.
- The route remains a scaffold until policy, persistence, evidence, and release gates allow live classroom workflows.
