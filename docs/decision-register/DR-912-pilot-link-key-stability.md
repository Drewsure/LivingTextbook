# DR-912: Pilot Link Key Stability

## Decision

Key pilot command-view links by destination and label together, and verify the
key contract statically.

## Included

- React key collision fix for duplicate pilot destinations.
- Regression marker in review-list key verification.

## Excluded

Route changes, navigation permissions, partner data capture, and classroom
launch behavior.

See ADR 0840.
