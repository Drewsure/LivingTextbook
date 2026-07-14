# ADR 0205: Flip Tiles Cross-Game Upload And Font Guide

Date: 2026-07-14

## Status

Accepted

## Context

The current upload-panel reference is a Flip Tiles-style authoring screen. It should not be treated as a one-off Flip Tiles-only design. The same row model, media attachment positions, formatting tools, and teacher workflow can guide several other templates after compatibility review.

The user also identified fonts as part of this foundation. Font and text rendering choices matter for young learners, Japanese hiragana/furigana support, white-label branding, printable output, tile sizing, and accessibility.

## Decision

Treat Flip Tiles as the concrete source template and promote its content-entry pattern into a cross-game upload guide.

Add approved font and rendering controls to the teacher intake scaffold and draft workbench preview. Font controls are tenant-approved configuration only, not arbitrary teacher styling.

## Consequences

Future authoring work can reuse the same upload guide for flashcards, matching, quiz, sentence builder, labelled diagram, media playlist, and printable outputs when compatibility rules permit.

Future font controls must preserve readability, licensing, accessibility, language rendering, tile layout stability, and print/export behavior before student-facing use.
