# ADR 0292: AI-Generated Package Manifest Preview

Status: Accepted  
Date: 2026-07-31

## Decision

Add a review-only AI-generated package manifest preview to `/teacher/generator/sample-publisher`.

The manifest links the generator request, prompt package, Draft JSON preview, audio coverage plan, engine binding plan, gamification mapping plan, verifier submission packet, and review queue item before any package assembly storage exists.

## Rationale

The generator needs one future package assembly target, not a loose set of disconnected panels. A manifest gives future backend, local bundle, verifier, and review work a shared vocabulary while preserving the current no-publish/no-assignment boundary.

## Consequences

- Generated drafts must name `ai_generated_package_manifest` alongside package, verifier, audio, engine, gamification, compatibility, media-rights, and approval records.
- Package assembly, route registry writes, media playlist writes, assignment writes, local bundle writes, and student-ready marking remain blocked.
- The teacher generator route now shows the bundle shape that future durable storage and adapter work should implement.
