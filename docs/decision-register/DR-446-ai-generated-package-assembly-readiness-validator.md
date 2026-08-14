# DR-446: AI Generated Package Assembly Readiness Validator

## Status

Accepted.

## Context

Generated package assembly readiness is the decision point before assembly dry-run artifacts and future package-writer work can be trusted. It must preserve every required lane while keeping package assembly, route writes, playlists, local bundles, assignments, student-ready markers, and support-language-only assembly blocked.

## Decision

Add a shared `validateAiGeneratedPackageAssemblyReadiness` guard in the content model and require the teacher generator route to show its active guard, guard blocks, and guard warnings.

The guard requires manifest, promotion, publish readiness, release candidate, teacher approval, media-rights, and target-language audio lanes; blocked assembly actions; next records; support-language boundaries; and blocked package, route, and local-bundle targets.

## Consequences

- Assembly readiness stays review-only until future release-control and package-writer gates exist.
- Assembly dry-run and writer work cannot treat a readiness panel as valid unless it passes the shared guard.
- MiniStar English remains the target-language assembly trigger, with Japanese support remaining hiragana-only and support-only.
