# ADR 0440: AI Verifier Result Evidence Packet

Status: Accepted

## Context

The generator route now has request packets, draft handoff, repair evidence, verifier submission packets, and verifier storage guards. It still needs a review-only result shape before teacher approval prep can depend on verifier output.

## Decision

Add an AI verifier result evidence packet as an offline review preview.

The packet links verifier submission, verifier storage, draft repair evidence, schema validation, pedagogical lock, target-language audio approval, media-rights evidence, activity compatibility, and gamification records. It keeps result state as `verifier-result-not-submitted`.

## Consequences

- Teacher approval prep can reference a defined verifier result evidence shape.
- Live verifier calls remain blocked.
- Pass/fail finalization remains blocked.
- Package approval, routes, playlists, assignments, and student-ready state remain blocked.
- MiniStar support-language rules remain preserved in verifier-result evidence.

## Non-Goals

This does not implement live verifier calls, AI provider integration, pass/fail scoring, teacher approval capture, package approval, route writes, playlist writes, assignments, student-ready markers, or support-language progress.
