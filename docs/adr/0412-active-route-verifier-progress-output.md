# ADR 0412: Active Route Verifier Progress Output

Date: 2026-08-21

## Status

Accepted

## Context

The active route verifier protects a growing white-label foundation, but the previous output shape printed only after all route checks completed. With many dynamic pages, that made a slow or stuck route look like a frozen command.

## Decision

The verifier will check heavy shell routes sequentially before the concurrent worker pool, stream route results as they complete, keep passing output compact, and use smaller bounded fetch batches.

## Consequences

- Build sessions get faster feedback on the exact route being checked.
- Cold-start and worker-pool false negatives on the heaviest local preview routes are reduced.
- Route failures remain strict.
- Console output becomes easier for the user to scan.
- Expected-text coverage remains in place even though pass output is summarized.
