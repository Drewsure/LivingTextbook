# ADR 0124: Teacher Report Package Preview Route

## Status

Accepted

## Context

Teacher report package boundaries are now visible and represented in persistence planning. Reviewers still needed a concrete read-only view of the sanitized rows a future export would contain.

## Decision

Add `/teacher/sessions/[launchCode]/report-package` as a read-only report package preview route.

## Consequences

- Pilot and partner conversations can inspect report format without enabling live export.
- Route verification covers the preview for both MiniStar and sample-publisher sessions.
- Export remains blocked until backend and policy gates are closed.
- The preview reinforces support-only event semantics before report aggregation is implemented.
