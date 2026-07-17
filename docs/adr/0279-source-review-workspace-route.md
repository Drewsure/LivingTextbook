# ADR 0279: Source Review Workspace Route

## Status

Accepted.

## Context

Source review was visible on `/teacher/intake`, but PDF/DOCX onboarding and media source review are large enough to need their own route boundary. Without that boundary, future upload controls, OCR extraction, parser import, AI extraction, teacher authoring, and assignment workflows could become tangled.

## Decision

Add `/teacher/sources/[tenantId]` as a read-only teacher source review workspace. The first active route is `/teacher/sources/sample-publisher`, with MiniStar supported by the same route resolver.

## Consequences

- Source review has a direct tenant-scoped route for partner pilots.
- The partner demo can point to source review before upload/evidence/release handoff.
- OCR, parser, AI extraction, media source indexing, and PDF/DOCX onboarding remain evidence-first.
- This does not enable live upload, extraction, route creation, playlist creation, package release, or assignment.
