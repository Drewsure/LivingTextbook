# ADR 0854: Local Bundle Visual Asset Coverage

## Status

Accepted for foundation rehearsal.

## Context

The shared local manifest contract already supports image assets, but the
tenant-facing planning summaries demonstrated only audio and video. That gap
could allow future local-package work to overlook visual activities such as
Labelled Diagram.

## Decision

Add tenant-scoped planning image entries to both sample local bundles and show
them through the same read-only resolver evidence surface. Treat these entries
as planning records with pending checksums and rights review.

## Boundaries

This does not add file pickers, image processing, label/anchor editing, alt
text approval, local file reads, media caching, student-facing image routes,
or offline activation. Image entries cannot become playable assets until the
asset, rights, accessibility, tenant, and release gates close.

## Consequences

The local package shape now reflects the actual multimedia scope of the
platform while retaining a clear review-only path for visual content.
