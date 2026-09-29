# ADR 1292: Tenant-Scoped Media Library Empty State

Date: 2026-09-30  
Status: Accepted

## Context

The white-label pilot now has tenant-aware upload, source, and evidence entry
points. The teacher media library still required one of the two demo tenants,
which made the multimedia path stop before a publisher could review its own
media intake.

## Decision

Resolve the media library through the shared tenant resolver. Known tenants
retain their approved media preview and records. A safe tenant without
admitted media receives an empty library preview, with a link to upload intake.
Rights, assist-language audio, reviewer, and release records are always
filtered by tenant.

## Consequences

- A publisher can follow the upload → source → evidence → media review path.
- No tenant receives another tenant's media or rights records.
- The empty preview makes the missing asset evidence visible without implying
  package readiness.
- Upload, transcode, playlist, media-only progress, local activation, and
  student-facing media remain blocked.

See DR-1008.
