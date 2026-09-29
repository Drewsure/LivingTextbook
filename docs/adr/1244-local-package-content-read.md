# ADR 1244: Local Package Content Read

## Status

Accepted for the first white-label pilot foundation.

## Context

The local package runtime can validate and navigate package metadata, but a
local companion cannot render a textbook unit unless it can read the approved
content package from the assembled directory. This read must be stricter than
an arbitrary JSON file reader and must not become a learner-data or persistence
shortcut.

## Decision

Add a separate, disabled-by-default content reader and API route. It first
requires a successful local runtime metadata read, then resolves the declared
content package path inside the package directory, validates the canonical
content model, binds tenant/package identity, requires approved review status,
and rejects learner/progression records.

## Consequences

- A future local game runtime can consume the same reviewed content package as
  the hosted application.
- The package has distinct metadata, content, and learner-persistence lanes.
- The content gate must be explicitly enabled only after publisher release and
  local-device review evidence exists.

