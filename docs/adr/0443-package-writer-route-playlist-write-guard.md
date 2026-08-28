# ADR 0443: Package Writer Route And Playlist Write Guard

Status: Accepted

## Context

The AI generated package writer lane now reaches a harness implementation decision preview. The next named record is a route and playlist write guard, but the product needs that guard shaped before any future writer can touch URLs, QR redirects, playlists, or teacher/student route boundaries.

## Decision

Add a shared route and playlist write guard contract, sample tenant records, and generator-route panel. The guard remains review-only and blocked.

## Consequences

- Student route registry, teacher route registry, media playlist, QR deep-link, and route smoke surfaces are explicit protected surfaces.
- Stable QR checks, target-language route checks, teacher route isolation, media-rights checks, target-language-audio-first playlist checks, and background media opt-in checks are required.
- Route writes, playlist writes, QR mutation, student-facing route activation, writer execution, and support-language-only route or playlist approval remain blocked.
- MiniStar English target-language trigger and hiragana support-only rules remain visible.

## Non-Goals

This does not implement a route writer, playlist writer, QR redirect workflow, media upload, student route activation, package writer harness, or live assignment workflow.
