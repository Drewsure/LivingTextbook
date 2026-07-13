# ADR 0197: Upload Promotion Storage Contract

Date: 2026-07-13

## Status

Accepted

## Context

The upload promotion readiness preview defines target-specific lanes for PDF/text, image, audio/music, and video uploads. Those lanes need durable gate records before live promotion can create draft packages, game assets, media playlists, local bundle files, or assignments.

## Decision

Add `upload-promotion` / `upload_promotion_gate` as a backend-neutral storage category.

The contract preserves target kind, target mapping, required gates, blockers, source lineage snapshot, upload review linkage, and student-facing promotion blocks. Hosted and local adapters must not treat object storage paths, local folders, or queue decisions as promotion.

## Consequences

Future upload promotion work can remain target-specific while sharing one gate vocabulary. Promotion gates remain blockers until the target record, target review, and release-control policy exist.
