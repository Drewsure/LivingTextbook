# Build Session Note: Assignment Rollout Generated Evidence Storage Revision

Date: 2026-08-28

## What Changed

- Revised teacher assignment rollout gate storage to preserve generated-package handoff source evidence packet ids.
- Added generated package policy note and blocked generated package handoff field to the schema and migration spec.
- Required hosted and local adapter plans plus durable record contracts to preserve generated-package handoff evidence.
- Updated assignment rollout contract, verification checks, build sessions, and decision register.

## Why

Generated package evidence should not create a second path into student assignment. It must use the existing teacher assignment rollout gate, while preserving enough source evidence for future hosted, local, and school-policy review.

## Guardrail

The new fields are evidence-only. They do not schedule classes, activate private links, bind rosters, start progress streams, export reports, launch classrooms, write learner data, store raw audio/transcripts, or allow support-language-only progress.
