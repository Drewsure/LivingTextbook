# ADR 0202: Teacher Media Library Preview Route

Date: 2026-07-14

## Status

Accepted

## Context

White-label textbook partners need to maintain audio, music, videos, posters, playlists, game-background media, and local/offline media over time. The foundation already defines media upload readiness and storage contracts, but the product also needs a visible review surface before live upload or replacement workflows exist.

## Decision

Add `/teacher/media/sample-publisher` as a read-only teacher/publisher media library preview.

The route shows media rights state, required target records, preview-only maintenance stages, and blocked live actions. It does not upload, store, replace, transcode, publish, assign, or activate media.

## Consequences

The app now has a visible future home for partner media maintenance without enabling live file workflows. Future media work should extend this route only after storage, rights, release-control, local bundle, and teacher-control gates remain green.
