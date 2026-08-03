# DR-356: AI Generated Package Assembly Dry Run

Date: 2026-08-02

## Decision

Show review-only generated package assembly dry runs after assembly readiness on tenant generator routes.

## Why

The product needs a visible artifact map before package builders exist. Teachers, content reviewers, and platform admins should be able to inspect the future package JSON, route, playlist, local bundle, and assignment shell shape without any write action.

## Required Preview

- Generated package JSON.
- Route registry entry.
- Media playlist binding.
- Local companion artifact.
- Assignment shell.
- Source records and blocked writes for each artifact.

## Blocks

- No package JSON write from dry run.
- No route registry write from dry run.
- No media playlist write from dry run.
- No local bundle write from dry run.
- No assignment from dry run.
- No student-ready marker from dry run.
- No support-language-only assembly dry run.
