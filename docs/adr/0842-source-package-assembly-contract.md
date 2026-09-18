# ADR 0842: Source-to-Package Assembly Contract

## Decision

Introduce a shared, review-only source package assembly packet between
extraction evidence and canonical package drafts.

## Rationale

The source queue and extraction packets identify what was supplied and what an
extractor suggested, while the package runtime governs a completed package.
The assembly packet makes the bridge explicit: candidate units and media are
named, required handoff records are visible, and promotion flags stay false.

## Guardrails

- Tenant, source, extraction packet, checksum, and target package identity must
  be present.
- Required source extraction, teacher draft, and review-handoff records must be
  named.
- Draft creation, student-facing payload, and package promotion remain false.
- The packet is evidence for review and never a file upload, package write,
  release, route activation, or assignment.

## Excluded

OCR/parser execution, file storage, media transcoding, draft persistence,
package publication, QR activation, and student assignment.

See `docs/verification/SOURCE_PACKAGE_ASSEMBLY_CHECKS.md`.
