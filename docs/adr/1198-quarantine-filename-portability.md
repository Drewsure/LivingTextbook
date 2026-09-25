# ADR 1198: Quarantine Filename Portability

## Decision

Quarantine intake records must accept international filenames but reject
path-like, control-character, ambiguous-whitespace, trailing-dot, and reserved
Windows device-name values. The upload store normalizes backslash separators
before taking the basename, while the stored payload continues to use a
quarantine-generated filename.

## Why

Publisher packages can contain Japanese and other non-ASCII filenames, so an
ASCII-only rule would be an unnecessary white-label limitation. At the same
time, review metadata must be safe to display, export, and move between the
hosted and Windows local deployment paths. A portable filename boundary keeps
those concerns explicit without treating a filename as a storage path.

## Consequences

- Uploads remain quarantine-only and promotion-neutral.
- The original display filename is metadata, never the payload path.
- Filenames that cannot safely travel across the supported deployment channels
  are rejected before a review record is created.
- The rule must be revisited if a tenant requires a documented cross-platform
  naming exception; exceptions cannot weaken payload path isolation.
