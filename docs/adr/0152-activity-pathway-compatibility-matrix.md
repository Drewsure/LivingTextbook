# ADR 0152: Activity Pathway Compatibility Matrix

## Status

Accepted

## Context

The owner confirmed the architectural direction: Living Textbook should not imitate a giant switch-to-anything panel as the core promise. Teachers should receive streamlined, pre-reviewed game/activity options for each unit theme, with extra conversions governed by compatibility rules.

## Decision

Add an activity pathway compatibility matrix, admin panel, and verifier.

## Consequences

- Teacher/admin review now shows which outputs are offered, planned, teacher-review-only, premium, or blocked.
- Printable vocabulary and sentence practice are explicitly planned.
- Word Search and Crossword are explicitly blocked until text-only puzzle rules, layout validation, and reviewed clue requirements exist.
- Target-language trigger and support-language boundaries are visible in the compatibility panel.
- `npm run verify:activity-pathways` becomes part of `npm run verify:foundation`.
