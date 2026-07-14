# ADR 0219: Classroom Launch Gate Storage Contract

Date: 2026-07-15

## Status

Accepted

## Context

The classroom launch gate preview creates the final visible boundary before real children use a package. Before any live launch workflow or backend is chosen, the platform needs a backend-neutral record vocabulary for preserving that boundary.

## Decision

Add `classroom_launch_gate` / `classroom-launch-gate` to the backend schema draft, migration candidates, migration specs, durable record map, and persistence adapter write intents.

The record preserves launch status, source gate references, required-before-launch items, blocked actions, policy blockers, persistence blockers, real-learner-data blocks, and report-export blocks. It explicitly blocks live classroom launch and launch buttons until source gates, school policy, and accepted persistence pass.

## Consequences

- Hosted and local deployments share the same classroom launch gate record vocabulary.
- Future launch workflows must close release, approval, evidence, dry-run, policy, and persistence obligations before live controls appear.
- Launch gate records cannot collect real learner data, export reports, or approve a pilot by themselves.
