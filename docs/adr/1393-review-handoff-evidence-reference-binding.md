# ADR 1393: Bind evidence references to publisher review lanes

## Status

Accepted for review-only pilot foundation

## Context

The submission manifest now preserves exact evidence requests and asset
coverage. The review handoff still exposed generic evidence text, which could
sever the operator's view from the authoritative intake records.

## Decision

Add `evidenceRequestIds` to every publisher review-handoff lane. Derive the IDs
from manifest asset coverage, require them to resolve to known manifest
evidence, and require every manifest evidence request to appear in at least one
handoff lane.

## Consequences

- Reviewers can follow an asset from the manifest to its exact evidence records.
- Unmapped evidence cannot be mistaken for a complete handoff.
- The handoff remains metadata-only and all release, promotion, QR,
  persistence, and student actions remain blocked.
