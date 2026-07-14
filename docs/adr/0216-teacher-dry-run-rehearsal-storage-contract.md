# ADR 0216: Teacher Dry-Run Rehearsal Storage Contract

Date: 2026-07-15

## Status

Accepted

## Context

The teacher dry-run rehearsal preview creates a practical pre-classroom script. Before any live pilot workflow exists, the platform needs a backend-neutral record vocabulary for preserving rehearsal evidence without turning it into student progress, report export, or pilot approval.

## Decision

Add `teacher_dry_run_rehearsal` / `teacher-dry-run-rehearsal` to the backend schema draft, migration candidates, migration specs, durable record map, and persistence adapter write intents.

The record preserves route, game/audio, media/support-language, report/policy, and local fallback checks. It explicitly blocks student launch, real learner data collection, live progress storage, report export, raw learner audio, and learner transcripts.

## Consequences

- Hosted and local deployments share the same dry-run record vocabulary.
- Teachers can eventually produce audit-friendly rehearsal evidence.
- Dry runs cannot bypass publish gates, evidence packets, approval ledgers, policy, persistence, or classroom launch controls.
