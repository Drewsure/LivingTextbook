# ADR 1376: Distinguish Derived Game Evidence From Uploaded Assets

- Status: Accepted
- Date: 2026-10-01

## Context

The publisher package evidence reconciliation represented every lane using
publisher manifest asset IDs. Because games are generated from reviewed
content and canonical parent-engine pathways, the game lane was always marked
missing even when platform game evidence existed.

## Decision

Add a separate `derivedEvidenceRecordIds` field to each package evidence lane.
The game lane is seeded with curated activity pathway, canonical game
integration, and package game-audio record identities. Publisher files continue
to use `sourceAssetIds`. The game lane remains review-pending until its
references and all package gates are reviewed.

## Consequences

Reviewers can distinguish a missing publisher upload from a pending platform
review record. The model cannot treat derived records as files, and all
assembly, promotion, QR, persistence, and student-facing actions remain
blocked.
