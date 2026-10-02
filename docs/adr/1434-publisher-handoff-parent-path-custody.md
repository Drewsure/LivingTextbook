# ADR 1434: Publisher Handoff Parent-Path Custody

## Status

Accepted for the first saleable white-label pilot.

## Decision

The versioned publisher handoff revision helper must inspect every existing
path segment below the external source root before copying a declared file.
Symlinked or junction-like parent directories are rejected, not only linked
file leaves. Missing parent segments remain ordinary missing-file evidence so
the helper does not create publisher content or imply completeness.

## Consequences

Publisher input cannot escape its declared custody root through a linked media,
source, or evidence directory. The helper remains review-only and create-once.
Some filesystems may not permit the junction regression test; in that case the
self-test records a skip while the runtime path walk remains enforced.
