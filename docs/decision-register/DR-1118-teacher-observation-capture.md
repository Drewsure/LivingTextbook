# DR-1118: Teacher Observation Capture

## Decision

Require an explicit teacher action before creating human-observed browser
evidence. Store the first capture in a separate browser-local, tenant-bound
receipt and keep all live side effects disabled.

## Status

Implemented and verified for review-only rehearsal. A receipt does not make a
sample tenant pilot-ready or authorize hosted persistence.
