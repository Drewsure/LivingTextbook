# ADR 0840: Pilot Link Key Stability

## Status

Accepted.

## Decision

Pilot command-view navigation items must use a stable key derived from both
their destination and label. A destination may intentionally appear more than
once when the labels represent different adult-review actions.

## Rationale

The pilot page includes separate requirements and follow-up-preview links that
currently share a destination. Keying only by `href` produces a React identity
collision and can cause duplicated or omitted navigation items.

## Excluded

This does not change routes, permissions, launch behavior, or partner data
capture.
