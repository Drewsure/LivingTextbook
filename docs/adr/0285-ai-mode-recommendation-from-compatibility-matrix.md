# ADR 0285: AI Mode Recommendation From Compatibility Matrix

Status: Accepted  
Date: 2026-07-31

## Decision

Add an AI mode recommendation preview to the teacher generator route, sourced from the existing activity compatibility matrix.

The generator recommends a small curated pathway and shows blocked conversion guardrails. It does not create a broad switch-to-anything panel.

## Rationale

This turns the competitive feature review into a safer product shape. Teachers get fast, useful recommendations without exposing unsupported games, unreviewed conversions, or expensive maintenance promises.

## Consequences

- Generator recommendations reuse compatibility rules instead of duplicating mode logic.
- Blocked conversions remain visible with payload-fit and compatibility-rule explanations.
- Future live recommendations must persist an `activity_compatibility_snapshot` before package review.
