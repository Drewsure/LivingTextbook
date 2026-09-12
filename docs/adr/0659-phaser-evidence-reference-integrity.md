# ADR 0659: Phaser Evidence Reference Integrity

**Status:** Accepted  
**Date:** 2026-09-13

## Decision

Each Phaser candidate finding must reference a repository-relative file listed
in that candidate's hashed source-file manifest. The content-model validator
rejects findings whose evidence path is absent from the manifest.

## Rationale

An evidence citation is only useful when the cited file is part of the exact
source snapshot that was reviewed. This prevents a candidate packet from
appearing auditable while quietly relying on an unrecorded file or a different
source revision.

## Consequences

- Candidate review findings are traceable to immutable file evidence.
- Adding a new finding requires adding and hashing its source file first.
- This strengthens review only; it does not authorize source import, wrapper
  promotion, route activation, scoring changes, or student assignment.
