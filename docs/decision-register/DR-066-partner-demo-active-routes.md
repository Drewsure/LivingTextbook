# DR-066: Partner Demo Active Routes

## Decision

Keep the sample publisher partner demo route list aligned with the active scaffold routes.

## Rationale

The platform is white-label first. When MiniStar routes advance, the partner demo should expose the same reusable platform capability so the build does not accidentally become MiniStar-only.

## Consequences

- Partner demos can reach Quiz, Sentence Builder, Speak It, Training Academy, and teacher monitoring directly.
- Route helper usage reduces path drift.
- Permanent QR and pilot-release gates remain separate from demo shortcuts.

## Non-Goals

- Production partner launch approval.
- Partner authentication.
- Stored classroom reporting.
