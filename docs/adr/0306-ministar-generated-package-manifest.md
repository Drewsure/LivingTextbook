# ADR 0306: MiniStar Generated Package Manifest

Status: Accepted  
Date: 2026-07-31

## Decision

Add a review-only generated package manifest for the MiniStar Level 1 greetings generator request.

The manifest links the MiniStar prompt package, Draft JSON preview, audio coverage plan, engine binding plan, gamification mapping plan, verifier submission packet, and future teacher review queue item. It also keeps package assembly, route registry, media playlist, assignment, local bundle, and student-ready writes blocked.

## Rationale

The AI teaching game generator needs a single evidence bundle before any generated package can be discussed as publishable. The manifest gives reviewers the complete lineage of a generated MiniStar package without allowing the system to assemble or publish it.

Because publish readiness is derived from package manifests, this also exposes a blocked last-mile readiness gate for MiniStar while preserving all release-control boundaries.

## Consequences

- `/teacher/generator/ministar` now shows a MiniStar generated package manifest.
- The derived MiniStar publish readiness gate appears as blocked.
- Media-rights and teacher approval remain missing.
- Audio approval, durable storage, release-control binding, route creation, playlist creation, assignment, local bundle writes, and student-ready marking remain blocked.
