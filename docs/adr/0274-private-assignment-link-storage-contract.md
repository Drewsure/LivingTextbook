# ADR 0274: Private Assignment Link Storage Contract

Date: 2026-07-17

Status: accepted

## Context

Private assignment links are the first safe sharing path. They already exist as controlled route previews, but real pilot use needs durable link records before assignment URLs become access infrastructure.

## Decision

Add `private_assignment_link` / `private-assignment-link` as a backend-neutral storage contract.

The contract preserves tenant scope, assignment binding, package binding, launch-session binding, assignment path, student target path, access mode, visibility, safety boundaries, expiry policy, report boundary, and target-language trigger policy.

## Consequences

- Private assignment links stay tenant-scoped and student-focused.
- Public sharing, public community discovery, iframe embeds, teacher/admin controls, real learner data collection, and report export remain blocked.
- Hosted and local deployments use the same record vocabulary before real link access, revocation, school-year expiry, or reporting policy is designed.
