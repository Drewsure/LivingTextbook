# ADR 0198: Labelled Diagram Asset Readiness Preview

Date: 2026-07-14

## Status

Accepted

## Context

Image upload for Labelled Diagram is now governed by upload intake, review, and promotion gates. The next target-specific risk is treating a reviewed image as if it were already a game-ready asset. Labelled Diagram needs durable asset manifest and label anchor concepts before a live label editor or student-facing game route can exist.

## Decision

Add a Labelled Diagram asset readiness preview to `/teacher/intake`.

The preview defines the required `game_asset_manifest` and `label_anchor_record` shapes, including image rights proof, alt text, image safety review, anchor coordinate review, target-language label text, audio label coverage, support-language support-only behavior, and asset release gate requirements.

## Consequences

Future Labelled Diagram work must preserve the asset/anchor boundary. Uploaded images cannot become student-facing games, auto-generated label sets, live label-editor records, or progress-triggering support-language labels without the target records and release gates.
