# ADR 0192: Upload Channel Readiness Preview

Date: 2026-07-13

## Status

Accepted

## Context

The platform needs uploads for PDFs, text sources, images, audio, music, and video. Uploads affect source review, Labelled Diagram games, unit playlists, background media, and local companion bundles.

## Decision

Add an upload channel readiness preview to `/teacher/intake`.

The preview treats uploads as governed intake records first. It shows required channels for PDF/text source intake, Labelled Diagram images, audio/music, and video while blocking live student-facing use until source lineage, rights, file policy, review, audio coverage, route mapping, and package release gates pass.

## Consequences

Future upload work must start from channel-specific contracts rather than generic file pickers. The platform can support partner media and textbook uploads without allowing unreviewed files to become games, assignments, or local bundle assets.
