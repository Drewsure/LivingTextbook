# ADR 0204: Draft Content Entry Workbench Preview

Date: 2026-07-14

## Status

Accepted

## Context

The teacher intake route now defines the required authoring/upload option scaffold. The actual teacher draft route also needs a visible place where those controls will live, otherwise future implementation may drift into a separate one-off editor.

Live save, upload, AI generation, template switching, and Done-to-student routing remain unsafe until draft persistence, rights review, audio coverage, activity compatibility, and release-control gates are implemented.

## Decision

Add a disabled content-entry workbench preview to `/teacher/authoring/draft-sample-publisher-l1-u1`.

The preview shows activity title, instruction, single/double sided rows, front/back fields, audio cue requirements, image upload positions, formatting tools, row actions, add item, AI draft help, flip tiles, item limits, and Done while keeping all live actions blocked.

## Consequences

The teacher draft route now has a structural landing zone for the future authoring workbench. Any live implementation must replace or extend this preview without bypassing teacher draft storage, review handoff, upload intake/review/promotion, audio coverage, compatibility snapshots, or release gates.
