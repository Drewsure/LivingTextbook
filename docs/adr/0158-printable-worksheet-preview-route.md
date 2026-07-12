# ADR 0158: Printable Worksheet Preview Route

## Status

Accepted

## Context

Teachers and textbook partners expect printable companion materials. Living Textbook should support that expectation, but PDF export, QR placement, rights snapshots, and teacher export policy are not ready.

## Decision

Add `/print/[code]` as a browser-print worksheet preview route for reviewed package data.

## Consequences

- MiniStar and sample publisher routes both render printable vocabulary and sentence previews.
- The teacher launch page links to the current unit printable preview.
- The partner demo route list links to the sample publisher printable preview.
- The first printable route is checked by active route verification.
- Basic browser-print preview is ready.
- PDF export remains blocked.
- QR/audio bridge, version and rights snapshot, and teacher export policy remain required before formal printable handoff.
