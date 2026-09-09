# ADR-0523: Approved Video Accessibility Evidence

Status: Accepted

## Context

Living Textbook supports optional lesson videos and music videos in teacher-led and student self-play flows. The media contract already names posters, captions, transcripts, fallback behavior, and learning-audio priority, but package approval did not yet enforce poster or transcript/caption references.

## Decision

When a content package claims approved status, every video asset must include a non-empty poster reference and a non-empty transcript or caption reference. This is evidence metadata only; it does not upload, transcode, store, or publish the files.

## Consequences

Approved video assets have a stable visual fallback and a reviewable access reference. Draft and reviewed videos can remain in repair state. Video remains optional enrichment and cannot unlock progress or replace target-language learning audio.

