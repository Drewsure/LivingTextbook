# ADR-0550: Progress Event Contract Revision Consistency

Status: Accepted  
Date: 2026-09-11

## Decision

Progress-event streams must use one `taxonomy_version` and one `settings_contract_id` value.

## Context

The stream validator already prevents mixed units, launches, and acceptance gates while allowing multiple learner sessions and curated game modes. A stream could still combine event records produced under different taxonomy or settings contract revisions.

## Consequences

- Mixed taxonomy revisions become review blockers.
- Mixed settings contract revisions become review blockers.
- Mode-specific settings profiles and teacher snapshots may vary inside one shared contract.
- This remains a verification guard before hosted, local, or hybrid adapters.

## Verification

- Runtime behavior rejects a stream with mixed taxonomy versions and settings contract IDs.
- Content-model and web typechecks must pass.
- Foundation verification must pass before release.
