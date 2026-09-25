# ADR 1200: Source Draft Import Checksum

## Decision

Review-only source draft import previews must validate their source checksum in
the canonical `sha256:<64 hexadecimal characters>` form before identity binding
is considered.

## Why

The draft-import preview is the last structured handoff before teacher-draft
persistence review. It must remain independently trustworthy even when a
caller has not yet supplied the upstream assembly and extraction packets.

## Consequences

- Standalone preview validation and cross-record binding enforce the same source
  identity shape.
- No storage, draft creation, assignment, or student-facing behavior is
  enabled by this change.
- Publisher intake fixtures must carry real-format checksum evidence.
