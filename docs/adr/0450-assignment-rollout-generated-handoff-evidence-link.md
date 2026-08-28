# ADR 0450: Assignment Rollout Generated Handoff Evidence Link

Status: Accepted

Date: 2026-08-28

## Context

The platform already has teacher assignment rollout gates for reviewed assignments. Generated-package assignment handoff evidence packets now exist, but they must not create a separate path around the existing rollout rules.

## Decision

Link generated-package assignment handoff evidence packets into the existing assignment rollout preview as source evidence ids and generated-package policy notes.

## Consequences

- Generated packages enter assignment planning through the same rollout gate language as ordinary reviewed packages.
- Handoff evidence remains review-only and cannot schedule classes, activate private links, bind rosters, start progress streams, export reports, launch classrooms, store raw learner audio/transcripts, or approve support-language-only handoff.
- MiniStar generated-package handoff evidence remains English-triggered and hiragana-support-only.
