# DR-079: Active Route Verification List

## Decision

Create a standing active route verification list for the current foundation build.

## Rationale

The app now has MiniStar, sample publisher, teacher, game, training, speech, and QR alias routes. A compact route list helps future checks move quickly without relying on chat history.

## Consequences

- Route checks have a single document.
- Future route changes should update the list and verification checks.
- Passing routes remain separate from pilot-publishable status.

## Non-Goals

- Public sitemap.
- Production route registry.
- Backend persistence.
