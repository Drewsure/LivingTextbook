# ADR 0195: Upload Review Storage Contract

Date: 2026-07-13

## Status

Accepted

## Context

The upload review queue preview shows required review packets and disabled decisions for uploaded PDFs, images, audio/music, and video. The next foundation step is a backend-neutral storage contract so future hosted, local, and hybrid implementations can persist those review decisions without enabling live promotion.

## Decision

Add `upload-review` / `upload_review_decision` as a backend-neutral storage category.

The contract preserves upload review packets, reviewer identity, decision status, blockers, source lineage, rights proof, scan/file policy, target mapping, and promotion blocks. Hosted and local adapters must block student-facing uploaded file use and block upload promotion until target-specific review and release-control gates exist.

## Consequences

Future upload workflows can implement approve-for-draft, ready-for-asset-review, return-for-replacement, rights-request, OCR promotion, image-label promotion, media playlist promotion, or local-bundle promotion against one shared contract.

Until those later workflows exist, upload review records remain durable gates, not promotion actions.
