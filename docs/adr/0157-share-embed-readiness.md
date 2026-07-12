# ADR 0157: Share And Embed Readiness

## Status

Accepted

## Context

Competitor platforms often make sharing, public resource pages, and iframe embeds easy. Living Textbook needs the time-saving value, but white-label tenants also require private package boundaries, student privacy, rights control, and reporting safety.

## Decision

Add a share/embed readiness plan, teacher/admin panel, focused verifier, and contract.

## Consequences

- `/teacher/intake` shows private assignment, colleague sharing, public sharing, embed, and community discovery lanes.
- `npm run verify:share-embed` is part of `npm run verify:foundation`.
- Private assignment links remain the first share path.
- Public sharing and iframe embeds remain blocked for v1.
- Public community discovery remains blocked until moderation, copyright, privacy, and quality systems exist.
