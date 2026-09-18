# ADR 0863: Local Bundle Handoff Review Access

## Status

Accepted for foundation rehearsal.

## Context

Local companion handoff evidence is tenant-owned release metadata. The browser
preview can remain a static review surface, but any future hosted/local record
lookup needs an explicit teacher-only access boundary before a provider is
selected.

## Decision

Add a tenant-, bundle-, and packet-scoped `teacher-review` request contract
and a read-only API route. Reuse the existing teacher persistence
authorization seam. Until a local handoff provider is approved, the route
returns a blocked no-record response rather than synthesizing or exposing a
package record.

## Boundaries

The route is never student-facing. It does not read a database, package,
filesystem, or media asset; it does not export, activate, mutate redirects,
or write any record.

## Consequences

Future adapters have a stable, auditable access boundary and cannot quietly
turn a static local review preview into a broadly readable storage endpoint.
