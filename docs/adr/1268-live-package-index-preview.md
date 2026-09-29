# ADR 1268: Live Package-Index Preview

## Status

Accepted.

## Decision

Add a live quarantine package-index preview that inventories evidence lanes and
keeps route, media, QR, and local-fallback arrays empty until an approved
manifest and release receipt exist.

## Rationale

A publisher needs to see whether the submitted textbook package is complete
before the platform creates student-facing routes. Empty artifact paths are
safer and more truthful than deriving routes from incomplete evidence.

## Consequences

- Reviewers can see exactly which multimedia and game lanes remain open.
- The eventual package index has a clear evidence boundary.
- No preview can be mistaken for a released package or printable QR set.
