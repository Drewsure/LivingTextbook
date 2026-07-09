# ADR 0059: Sentence Builder Playable Slice

Date: 2026-07-09

Status: accepted

## Context

Pairing has a playable Memory Match implementation. Selection and text-spelling have previews. Sentence Builder is the natural next playable mode because it exercises target sentence structures and upper-level syntax growth.

## Decision

Add `/sentence/[code]` with a structural Sentence Builder implementation.

## Implications

The route is not production persistence and not premium polish. It is a reusable text-spelling foundation that validates sentence payload, tile order, audio, events, and scoring.
