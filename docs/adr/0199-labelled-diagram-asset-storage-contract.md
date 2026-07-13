# ADR 0199: Labelled Diagram Asset Storage Contract

Date: 2026-07-14

## Status

Accepted

## Context

The Labelled Diagram asset readiness preview names two required target records: `game_asset_manifest` and `label_anchor_record`. Those records must be part of the backend-neutral storage contract before any live image-game asset library, label editor, coordinate editor, or student-facing Labelled Diagram route is implemented.

The platform must support both hosted white-label deployments and closed/local textbook packages. Therefore, image asset storage cannot rely on folder placement, preview state, or object storage path alone.

## Decision

Add backend-neutral storage contracts for `game_asset_manifest` and `label_anchor_record`.

The game asset manifest preserves source upload lineage, upload review lineage, upload promotion gate lineage, image metadata, rights proof, alt text, target language, review status, release gate status, and student-facing asset blocks.

The label anchor record preserves target-language label text, support-language support-only text, reviewed anchor geometry, label audio cue id, label review status, support-language progress blocks, and student-facing anchor blocks.

Hosted and local adapter plans must preserve the same contract. Backend schema drafts, migration candidates, migration specs, durable record contracts, and verification scripts must all include the two records.

## Consequences

Labelled Diagram can proceed later from a stable storage foundation. Uploaded images cannot become active game assets, auto-generated labels cannot become active labels, and support-language labels cannot trigger progress without violating the verifier.

This does not implement live uploads, image storage, a coordinate editor, a label editor, or a student-facing Labelled Diagram game.
