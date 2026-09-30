# ADR 1365: Deliberate Local Package Operator Command

## Status

Accepted for the controlled pilot handoff.

## Decision

Provide one reproducible operator command for the local package endpoint. It
defaults to read-only preflight. Assembly is available only when the caller
has the tenant-scoped pilot delivery API token and supplies the explicit
`ASSEMBLE_LOCAL_PACKAGE` confirmation environment value.

## Rationale

The package assembler already has the required custody and release gates, but
an actual publisher handoff needs a documented invocation surface. A default
dry-run prevents accidental writes while preserving a practical route to a
reviewed local package.

## Boundary

The command does not approve evidence, expose request payloads or credentials,
or bypass package, asset, QR, persistence, privacy, or student-safety gates.
Its output is bounded metadata only.
