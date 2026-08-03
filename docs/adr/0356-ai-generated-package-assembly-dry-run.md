# ADR 0356: AI Generated Package Assembly Dry Run

Status: accepted

## Context

Assembly readiness explains whether a generated draft can become a real package. Reviewers also need to see what would be produced after the gates clear without giving the system any write path.

## Decision

Add review-only AI generated package assembly dry runs to tenant generator routes after assembly readiness.

The dry run previews package JSON, route registry entry, media playlist binding, local companion artifact, and assignment shell artifacts. It links those previews back to readiness, manifest, promotion, publish, release, approval, media-rights, audio, and launch records.

## Consequences

- Reviewers can inspect future package artifacts before real package builders exist.
- Package JSON writes, route registry writes, playlist writes, local bundle writes, assignments, student-ready markers, and support-language-only assembly remain blocked.
- The dry run gives future implementation work a target artifact map without becoming a generator shortcut.
