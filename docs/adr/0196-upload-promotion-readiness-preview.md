# ADR 0196: Upload Promotion Readiness Preview

Date: 2026-07-13

## Status

Accepted

## Context

Upload intake and upload review records now define how files enter the platform and how review decisions are stored. The next risk is accidental promotion: treating a reviewed file, object storage path, local folder, or disabled queue decision as if it were already a student-facing draft, game asset, playlist item, or local bundle file.

## Decision

Add a target-specific upload promotion readiness preview to `/teacher/intake`.

The preview defines lanes for PDF/text to draft package, Labelled Diagram asset promotion, audio/music playlist promotion, and video/local bundle promotion. Each lane names required gates, blockers, preview-only actions, forbidden shortcuts, and storage required before live promotion.

## Consequences

Future upload work must pass through target-specific promotion contracts. A reviewed upload cannot become a draft, game asset, playlist item, local bundle file, or assignment by folder placement, object storage location, or queue decision alone.
