# ADR 0095: Active Route Matrix Full Local Links

## Status

Accepted

## Context

The active route matrix made current scaffold routes visible, but it displayed relative paths. The repository owner has repeatedly asked for full local addresses to speed browser testing.

## Decision

Display full `http://127.0.0.1:3000` local URLs in the active route matrix and keep each entry clickable.

## Consequences

Manual route testing is faster. The panel remains explicitly non-production and does not change QR readiness, publish gates, or route contracts.
