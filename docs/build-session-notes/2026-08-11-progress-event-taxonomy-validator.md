# Build Session Note: Progress Event Taxonomy Validator

Date: 2026-08-11

## What Changed

- Added a shared progress event taxonomy validator in `packages/content-model`.
- Reused the validator from the sample taxonomy data.
- Surfaced taxonomy guard blocks and warnings on the teacher intake page.
- Extended taxonomy and active-route verification so guard visibility is checked automatically.

## Why

Game, media, speech, AI Tutor, reward, upload, assignment, report, and storage work all depend on the same event boundary. This guard keeps support-only and report-only activity from accidentally becoming mastery, Star Dust, scoring, or unlock evidence.

## Follow-Up

When new event types are introduced, update `GameEventType`, the taxonomy registry, the validator category sets, route checks, and the storage migration plan in the same work session.
