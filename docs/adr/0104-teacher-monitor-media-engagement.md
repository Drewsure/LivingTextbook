# ADR 0104: Teacher Monitor Media Engagement

## Status

Accepted

## Context

The app now includes active media playlist routes and student/teacher media shortcuts. Teacher session reports already counted media events in summary form, but did not show a focused asset-level view.

## Decision

Add a `Media engagement` section to the teacher session monitor and enrich sample monitor events with media pause, completion, and background-media records.

## Consequences

Teachers can inspect media usage without confusing it with progression. The report remains backend-agnostic and uses sample events only until persistence is selected.
