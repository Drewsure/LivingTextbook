# ADR 1304: Bind reviewed package lanes to evidence references

## Decision

Each package-evidence lane must carry a bounded `referenceId` when a reviewer
records that lane as reviewed. The canonical lanes remain content, game, audio,
video, image, font, accessibility, and rights. A package may reach the
reviewed-package-evidence state only when every lane is checked and every lane
has a valid reference ID.

The references are metadata-only identifiers for existing review records,
fixtures, reports, or approved tenant assets. They do not copy payload bytes,
create storage locations, or authorize package assembly.

## Rationale

A checkbox-only attestation is too weak for a saleable white-label package. A
publisher and school need to know which content, game, audio, media, font,
accessibility, and rights records were actually reviewed. Reference binding
creates traceability while preserving the existing fail-closed release model.

## Safety boundary

Reference IDs are length-bounded and path-safe. The record remains immutable,
tenant-bound, checksum-bound, review-only, and explicitly false for package
assembly, promotion, QR printing, and student-facing use.

## Not authorized

This decision does not resolve whether a referenced record is approved for
release. Release, local package writing, hosted persistence, QR printing, and
student activation remain separate gates.
